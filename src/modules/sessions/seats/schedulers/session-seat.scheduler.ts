/**
 * @fileoverview Scheduler for managing session seat reservation expirations.
 *
 * @description
 * This file contains the scheduler class responsible for periodically checking
 * and processing expired session seat reservations. It handles the cleanup of
 * expired reservations and emits corresponding events.
 *
 * @module session-seat.scheduler
 */

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SessionSeatReservationsRepository } from '../repositories';
import { Transactional } from '@nestjs-cls/transactional';
import { SessionSeatsProducer } from '../events/producers';
import { CacheLockService } from '../../../../shared/cache/cache-lock.service';

/**
 * Scheduler for session seat reservation expiration handling.
 *
 * @description
 * Provides scheduled tasks for managing session seat reservations, including
 * detecting expired reservations, emitting expiration events, and cleaning up
 * stale reservation records. Runs periodically to ensure timely processing.
 *
 * @class SessionSeatScheduler
 *
 * @example
 * // The scheduler is automatically invoked by NestJS scheduling
 * // No manual invocation is required
 */
@Injectable()
export class SessionSeatScheduler {
  /**
   * Logger instance for the scheduler.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(SessionSeatScheduler.name);

  /**
   * Creates an instance of SessionSeatScheduler.
   *
   * @param {SessionSeatReservationsRepository} sessionSeatReservationsRepository - Repository for session seat reservation operations.
   * @param {SessionSeatsProducer} sessionSeatsProducer - Producer for emitting session seat events to Kafka.
   * @param {CacheLockService} cacheLockService - Service for acquiring and releasing locks.
   */
  constructor(
    private readonly sessionSeatReservationsRepository: SessionSeatReservationsRepository,
    private readonly sessionSeatsProducer: SessionSeatsProducer,
    private readonly cacheLockService: CacheLockService,
  ) {}

  /**
   * Handles the expiration of session seat reservations.
   *
   * @description
   * This scheduled task runs every 10 seconds to check for expired session seat
   * reservations. For each expired reservation, it emits a reservation expired
   * event and a session seat released event in parallel, then deletes the
   * reservation record from the database.
   *
   * @returns {Promise<void>} A promise that resolves when all expired reservations have been processed.
   *
   * @example
   * // This method is automatically invoked by the scheduler every 10 seconds
   * // It processes expired reservations as follows:
   * // 1. Fetches all expired reservations from the database
   * // 2. For each reservation:
   * //    - Sends reservation expired event to Kafka
   * //    - Sends session seat released event to Kafka
   * //    - Deletes the reservation from the database
   * // 3. Logs the number of processed reservations and execution time
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  @Transactional()
  async handleSessionSeatReservationExpiration(): Promise<void> {
    const lock = await this.cacheLockService.tryAcquireLock(
      'locks:scheduler:session-seat-reservation-expiration',
      5_000,
    );
    if (!lock) return;

    try {
      const startTime = performance.now();

      const expiredReservations =
        await this.sessionSeatReservationsRepository.listExpiredSessionSeatReservations();

      for (const reservation of expiredReservations) {
        // Process reservations and kafka events in parallel to improve performance
        await Promise.all([
          this.sessionSeatsProducer.sendReservationExpiredEvent({
            id: reservation.id,
            createdAt: reservation.createdAt,
            userId: reservation.userId,
            sessionSeatId: reservation.sessionSeatId,
            expiresAt: reservation.expiresAt,
          }),
          this.sessionSeatsProducer.sendSessionSeatReleasedEvent({
            id: reservation.sessionSeatId,
            releasedAt: new Date(),
          }),
        ]);
        await this.sessionSeatReservationsRepository.delete(reservation.id);
      }

      if (expiredReservations.length > 0)
        this.logger.debug(
          `Found ${expiredReservations.length} expired session seat reservations, processed in: ${performance.now() - startTime}ms`,
        );
    } finally {
      await lock.release();
    }
  }
}
