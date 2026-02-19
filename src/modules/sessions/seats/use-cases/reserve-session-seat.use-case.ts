/**
 * @fileoverview Use case for reserving a session seat.
 *
 * @description
 * This file contains the use case responsible for handling session seat reservations.
 * It validates seat availability, checks for existing reservations, creates new
 * reservations with a timeout, and emits reservation events.
 *
 * @module reserve-session-seat.use-case
 */

import { Injectable, Logger } from '@nestjs/common';
import { IReserveSessionSeatUseCase } from '../interfaces';
import {
  SessionSeatReservationsRepository,
  SessionSeatsRepository,
} from '../repositories';
import { SessionSeatsCacheService } from '../cache/services';
import { ReserveSessionSeatDto } from '../dtos';
import { SessionSeatReservationSchema } from '../schemas';
import {
  SessionSeatAlreadyReservedException,
  SessionSeatNotAvailableException,
} from '../exceptions';
import { SessionSeatsProducer } from '../events/producers';
import { Transactional } from '@nestjs-cls/transactional';
import { CacheLockService } from '../../../../shared/cache/cache-lock.service';
import { UnableToReserveSessionSeatException } from '../exceptions/unable-to-reserve-session-seat.exception';

/**
 * Use case for reserving a session seat.
 *
 * @description
 * Handles the business logic for creating a session seat reservation.
 * Validates seat availability and existing reservations, creates the reservation
 * with a configurable timeout, caches the reservation, and emits events.
 *
 * @class ReserveSessionSeatUseCase
 * @implements {IReserveSessionSeatUseCase}
 */
@Injectable()
export class ReserveSessionSeatUseCase implements IReserveSessionSeatUseCase {
  /**
   * The timeout duration for reservations in seconds.
   *
   * @private
   * @readonly
   */
  private readonly RESERVATION_TIMEOUT_IN_SECONDS = 30;

  /**
   * Logger instance for this use case.
   *
   * @private
   * @readonly
   */
  private readonly logger = new Logger(ReserveSessionSeatUseCase.name);

  /**
   * Creates an instance of ReserveSessionSeatUseCase.
   *
   * @param {SessionSeatReservationsRepository} sessionSeatReservationsRepository - Repository for session seat reservation operations.
   * @param {SessionSeatsRepository} sessionSeatsRepository - Repository for session seat operations.
   * @param {SessionSeatsCacheService} sessionSeatsCacheService - Cache service for session seats.
   * @param {SessionSeatsProducer} sessionSeatsProducer - Event producer for session seat events.
   */
  constructor(
    private readonly sessionSeatReservationsRepository: SessionSeatReservationsRepository,
    private readonly sessionSeatsRepository: SessionSeatsRepository,
    private readonly sessionSeatsCacheService: SessionSeatsCacheService,
    private readonly sessionSeatsProducer: SessionSeatsProducer,
    private readonly cacheLockService: CacheLockService,
  ) {}

  /**
   * Executes the session seat reservation process.
   *
   * @description
   * Acquires a distributed lock using Redis/Redlock to prevent race conditions
   * during concurrent reservation attempts for the same seat. The lock has a
   * 1-second TTL and uses the pattern `locks:reservation:{sessionSeatId}`.
   *
   * Once the lock is acquired, validates the session seat availability and checks
   * for existing reservations in parallel. If valid, creates a new reservation
   * with a 30-second timeout, caches the reservation, and emits a reservation
   * created event. The lock is released after the operation completes.
   *
   * @param {ReserveSessionSeatDto} data - The data containing user ID and session seat ID.
   * @returns {Promise<SessionSeatReservationSchema>} A promise that resolves to the created reservation.
   * @throws {SessionSeatNotAvailableException} When the session seat is not available.
   * @throws {SessionSeatAlreadyReservedException} When the session seat is already reserved.
   * @throws {UnableToReserveSessionSeatException} When the distributed lock cannot be acquired or the reservation fails.
   *
   * @example
   * const reservation = await useCase.execute({
   *   userId: '123e4567-e89b-12d3-a456-426614174000',
   *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440000',
   * });
   * // Returns: { id: '...', userId: '...', sessionSeatId: '...', expiresAt: Date, ... }
   */
  @Transactional()
  async execute(
    data: ReserveSessionSeatDto,
  ): Promise<SessionSeatReservationSchema> {
    const reservationStartTime = performance.now();

    const lock = await this.cacheLockService.acquireLock(
      `locks:reservation:${data.sessionSeatId}`,
      1000,
    );

    if (!lock)
      throw new UnableToReserveSessionSeatException(
        'Failed while trying to reserve session seat, please try again later',
      );

    try {
      // Validate session seat and reservation in parallel to improve performance
      await Promise.all([
        this.validateSessionSeat(data.sessionSeatId),
        this.validateReservation(data.sessionSeatId),
      ]);

      // 30 seconds reservation timeout
      const expiresAt = new Date(
        Date.now() + 1000 * this.RESERVATION_TIMEOUT_IN_SECONDS,
      );

      await this.sessionSeatsCacheService.setSeatReservation(
        data.sessionSeatId,
        expiresAt,
      );

      this.logger.debug(
        `Session seat validation time: ${performance.now() - reservationStartTime}ms`,
      );

      // Process reservations and cache in parallel to improve performance
      const [reservation] = await Promise.all([
        this.sessionSeatReservationsRepository.insert({
          userId: data.userId,
          sessionSeatId: data.sessionSeatId,
          expiresAt: expiresAt,
        }),
      ]);

      // Emit reservation created event
      await this.sessionSeatsProducer.sendReservationCreatedEvent({
        sessionId: data.sessionId,
        id: reservation.id,
        createdAt: reservation.createdAt,
        sessionSeatId: reservation.sessionSeatId,
        userId: reservation.userId,
        expiresAt: reservation.expiresAt,
      });

      this.logger.debug(
        `Reservation processing time: ${performance.now() - reservationStartTime}ms`,
      );

      return reservation;
    } finally {
      await lock.release();
    }
  }

  /**
   * Validates that the session seat is available for reservation.
   *
   * @description
   * First checks the cache for seat availability. If not cached, fetches from
   * the repository and caches the result. Throws an exception if the seat
   * is not available.
   *
   * @private
   * @param {string} sessionSeatId - The unique identifier of the session seat to validate.
   * @returns {Promise<void>} A promise that resolves when validation is complete.
   * @throws {SessionSeatNotAvailableException} When the session seat is not available.
   */
  private async validateSessionSeat(sessionSeatId: string): Promise<void> {
    const sessionSeatValidationStartTime = performance.now();

    const cachedAvailability =
      await this.sessionSeatsCacheService.getSessionSeatAvailability(
        sessionSeatId,
      );

    console.log(sessionSeatId, 'cachedAvailability', cachedAvailability);

    if (cachedAvailability !== null) {
      if (cachedAvailability === false)
        throw new SessionSeatNotAvailableException();

      this.logger.debug(
        `Session seat validation cache hit time: ${performance.now() - sessionSeatValidationStartTime}ms`,
      );

      return;
    }

    const sessionSeat =
      await this.sessionSeatsRepository.findByIdWithRelations(sessionSeatId);

    await this.sessionSeatsCacheService.setSessionSeatAvailability(
      sessionSeatId,
      sessionSeat.isAvailable,
      sessionSeat.relations?.session?.startTime,
    );

    if (!sessionSeat.isAvailable) throw new SessionSeatNotAvailableException();

    this.logger.debug(
      `Session seat validation time: ${performance.now() - sessionSeatValidationStartTime}ms`,
    );

    return;
  }

  /**
   * Validates that the session seat does not have an active reservation.
   *
   * @description
   * Checks the cache for an existing active reservation on the session seat.
   * Throws an exception if a reservation already exists.
   *
   * @private
   * @param {string} sessionSeatId - The unique identifier of the session seat to validate.
   * @returns {Promise<void>} A promise that resolves when validation is complete.
   * @throws {SessionSeatAlreadyReservedException} When the session seat already has an active reservation.
   */
  private async validateReservation(sessionSeatId: string): Promise<void> {
    const reservationCacheHitTime = performance.now();

    const lastReservation =
      await this.sessionSeatsCacheService.getSeatReservation(sessionSeatId);

    this.logger.debug(
      `Reservation cache hit time: ${performance.now() - reservationCacheHitTime}ms`,
    );

    if (lastReservation)
      throw new SessionSeatAlreadyReservedException(lastReservation);
  }
}
