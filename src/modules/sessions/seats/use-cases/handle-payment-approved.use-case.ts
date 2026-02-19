/**
 * @fileoverview Use case for handling payment approved events.
 *
 * @description
 * This file contains the use case responsible for processing payment approved
 * events. It updates the session seat availability and cache when a payment
 * is successfully approved.
 *
 * @module handle-payment-approved.use-case
 */

import { Injectable, Logger } from '@nestjs/common';
import { IHandlePaymentApprovedUseCase } from '../interfaces/handle-payment-approved.use-case';
import {
  SessionSeatReservationsRepository,
  SessionSeatsRepository,
} from '../repositories';
import { PaymentApprovedMessage } from '../../../payments/events/messages';
import { SessionSeatsCacheService } from '../cache/services';
import { Transactional } from '@nestjs-cls/transactional';

/**
 * Use case for handling payment approved events.
 *
 * @description
 * Handles the business logic for processing payment approved events.
 * When a payment is approved, this use case retrieves the associated
 * reservation, marks the session seat as sold, and updates the cache
 * to reflect the new availability status.
 *
 * @class HandlePaymentApprovedUseCase
 * @implements {IHandlePaymentApprovedUseCase}
 *
 * @example
 * // Handling a payment approved event
 * await handlePaymentApprovedUseCase.execute({
 *   externalId: 'reservation-uuid',
 *   // ... other payment message properties
 * });
 */
@Injectable()
export class HandlePaymentApprovedUseCase implements IHandlePaymentApprovedUseCase {
  /**
   * Logger instance for this use case.
   *
   * @private
   * @readonly
   */
  private readonly logger = new Logger(HandlePaymentApprovedUseCase.name);

  /**
   * Creates an instance of HandlePaymentApprovedUseCase.
   *
   * @param {SessionSeatReservationsRepository} sessionsSeatsReservationsRepository - The repository for session seat reservation operations.
   * @param {SessionSeatsRepository} sessionSeatsRepository - The repository for session seat operations.
   * @param {SessionSeatsCacheService} sessionSeatsCacheService - The cache service for session seat availability.
   */
  constructor(
    private readonly sessionsSeatsReservationsRepository: SessionSeatReservationsRepository,
    private readonly sessionSeatsRepository: SessionSeatsRepository,
    private readonly sessionSeatsCacheService: SessionSeatsCacheService,
  ) {}

  /**
   * Executes the payment approved handling logic.
   *
   * @description
   * Processes a payment approved event by:
   * 1. Retrieving the reservation associated with the payment
   * 2. Fetching the session seat with its relations
   * 3. Marking the seat as sold and assigning it to the user
   * 4. Updating the cache to reflect the seat is no longer available
   *
   * The entire operation is wrapped in a transaction to ensure data consistency.
   *
   * @param {PaymentApprovedMessage} payload - The payment approved message containing the external ID (reservation ID).
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   *
   * @example
   * await useCase.execute({
   *   externalId: '123e4567-e89b-12d3-a456-426614174000',
   *   // ... other payment properties
   * });
   */
  @Transactional()
  async execute(payload: PaymentApprovedMessage): Promise<void> {
    const startTime = performance.now();

    if (!payload.externalId) return;

    const reservation = await this.sessionsSeatsReservationsRepository.findById(
      payload.externalId,
    );

    const sessionSeat = await this.sessionSeatsRepository.findByIdWithRelations(
      reservation.sessionSeatId,
    );

    await this.sessionSeatsRepository.update(sessionSeat.id, {
      isAvailable: false,
      soldAt: new Date(),
      userId: reservation.userId,
    });

    await this.sessionSeatsCacheService.setSessionSeatAvailability(
      sessionSeat.id,
      false,
      sessionSeat.relations?.session?.startTime,
    );

    this.logger.debug(
      `Handle payment approved use case execution time: ${performance.now() - startTime}ms`,
    );

    return;
  }
}
