/**
 * @fileoverview Use case for handling a reservation created event.
 *
 * @description
 * This file contains the use case responsible for reacting to a reservation
 * created Kafka event. It determines the session seat price, creates a
 * corresponding payment record, and emits a payment created event.
 *
 * @module handle-reservation-created.use-case
 */

import { ReservationCreatedMessage } from '../../sessions/seats/events/messages';
import { IHandleReservationCreatedUseCase } from '../interfaces/handle-reservation-created.use-case-interface';
import { PaymentsRepository } from '../repositories/payments.repository';
import { SessionsService } from '../../sessions/core/services';
import { PaymentsProducer } from '../events/producers';
import { Injectable } from '@nestjs/common';

/**
 * Use case for handling a reservation created event and creating its payment.
 *
 * @description
 * Listens to reservation created Kafka messages and orchestrates the creation
 * of a linked payment. Retrieves the seat price for the session, inserts a
 * payment record with the reservation owner's user ID, the calculated amount,
 * and the reservation expiry, then emits a payment created event to notify
 * downstream consumers.
 *
 * @class HandleReservationCreatedUseCase
 * @implements {IHandleReservationCreatedUseCase}
 *
 * @example
 * await handleReservationCreatedUseCase.execute({
 *   id: 'reservation-uuid',
 *   sessionId: 'session-uuid',
 *   sessionSeatId: 'seat-uuid',
 *   userId: 'user-uuid',
 *   expiresAt: new Date('2026-03-01T00:05:00Z'),
 *   createdAt: new Date(),
 * });
 */
@Injectable()
export class HandleReservationCreatedUseCase implements IHandleReservationCreatedUseCase {
  /**
   * Creates an instance of HandleReservationCreatedUseCase.
   *
   * @param {PaymentsRepository} paymentsRepository - Repository for payment persistence operations.
   * @param {SessionsService} sessionsService - Service for retrieving session pricing information.
   * @param {PaymentsProducer} paymentsProducer - Kafka event producer for payment events.
   */
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly sessionsService: SessionsService,
    private readonly paymentsProducer: PaymentsProducer,
  ) {}

  /**
   * Executes the reservation created handling process.
   *
   * @description
   * Fetches the price per seat for the session referenced in the payload,
   * inserts a new payment record associating the payment with the reservation
   * owner and the computed amount, then emits a payment created Kafka event
   * so that downstream services are informed of the new pending payment.
   *
   * @async
   * @param {ReservationCreatedMessage} payload - The Kafka message payload containing reservation details.
   * @returns {Promise<void>} A promise that resolves when the payment has been created and the event emitted.
   */
  async execute(payload: ReservationCreatedMessage): Promise<void> {
    const sessionPrice = await this.sessionsService.getSessionValuePerSeat(
      payload.sessionId,
    );

    const payment = await this.paymentsRepository.insert({
      userId: payload.userId,
      amountInCents: sessionPrice,
      expiresAt: payload.expiresAt,
      externalId: payload.id,
    });

    await this.paymentsProducer.sendPaymentCreatedEvent({
      id: payment.id,
      userId: payment.userId,
      amountInCents: payment.amountInCents,
      expiresAt: payment.expiresAt,
      externalId: payment.externalId,
    });

    return;
  }
}
