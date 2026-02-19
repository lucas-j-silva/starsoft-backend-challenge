/**
 * @fileoverview Use case for handling session seat reservation conflicts.
 *
 * @description
 * This file contains the use case responsible for processing reservation
 * conflicts that occur when a payment is approved but the associated seat
 * was already sold. It handles the refund process by updating the payment
 * status to REFUNDED.
 *
 * @module handle-session-seat-reservation-conflict.use-case
 */

import { Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { PaymentsRepository } from '../repositories/payments.repository';
import { PaymentStatus } from '../enums/payment-status.enum';
import { SessionSeatReservationConflictMessage } from '../../sessions/seats/events/messages';

/**
 * Use case for handling session seat reservation conflicts.
 *
 * @description
 * This use case is invoked when a payment was approved but the associated
 * seat was already sold, resulting in a conflict. It retrieves the payment
 * by the reservation ID and updates its status to REFUNDED.
 *
 * @class HandleSessionSeatReservationConflictUseCase
 *
 * @example
 * await handleSessionSeatReservationConflictUseCase.execute({
 *   reservationId: '550e8400-e29b-41d4-a716-446655440000',
 *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440001',
 *   userId: '550e8400-e29b-41d4-a716-446655440002',
 * });
 */
@Injectable()
export class HandleSessionSeatReservationConflictUseCase {
  /**
   * Creates an instance of HandleSessionSeatReservationConflictUseCase.
   *
   * @param {PaymentsRepository} paymentsRepository - Repository for payment data access operations.
   */
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  /**
   * Executes the conflict handling logic by refunding the payment.
   *
   * @description
   * Retrieves the payment associated with the conflicting reservation and
   * updates its status to REFUNDED. This operation is wrapped in a transaction
   * to ensure data consistency.
   *
   * @async
   * @param {SessionSeatReservationConflictMessage} payload - The conflict event data containing
   *   the reservation ID, session seat ID, and user ID involved in the conflict.
   * @returns {Promise<void>} A promise that resolves when the payment has been refunded.
   *
   * @example
   * await useCase.execute({
   *   reservationId: '550e8400-e29b-41d4-a716-446655440000',
   *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440001',
   *   userId: '550e8400-e29b-41d4-a716-446655440002',
   * });
   */
  @Transactional()
  async execute(payload: SessionSeatReservationConflictMessage): Promise<void> {
    const payment = await this.paymentsRepository.findByIdOrExternalId(
      payload.reservationId,
    );

    await this.paymentsRepository.update(payment.id, {
      status: PaymentStatus.REFUNDED,
    });
  }
}
