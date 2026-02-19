/**
 * @fileoverview Consumer for handling payment approved events related to session seats.
 *
 * @description
 * This file contains the SessionSeatPaymentApprovedConsumer class which listens for
 * payment approved events from the payments microservice and processes them to update
 * session seat statuses accordingly.
 *
 * @module payment-approved.consumer
 */

import { Controller, Logger, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentsMessagesTopics } from '../../../../payments/events/enums/payments-messages-topics.enum';
import { PaymentApprovedMessage } from '../../../../payments/events/messages';
import { SessionSeatsService } from '../../services';
import { SessionSeatNotFoundException } from '../../exceptions';
import { SessionSeatReservationNotFoundException } from '../../exceptions/session-seat-reservation-not-found.exception';

/**
 * Consumer controller for processing payment approved events.
 *
 * @description
 * This controller listens for payment approved events from the payments microservice
 * and delegates the processing to the SessionSeatsService. It handles specific exceptions
 * gracefully to prevent event processing failures for non-critical errors.
 *
 * @class SessionSeatPaymentApprovedConsumer
 *
 * @example
 * // The consumer automatically handles incoming payment approved events
 * // No manual instantiation required - managed by NestJS dependency injection
 */
@Controller()
export class SessionSeatPaymentApprovedConsumer {
  /**
   * Logger instance for this consumer.
   *
   * @private
   * @readonly
   * @type {Logger}
   */
  private readonly logger = new Logger(SessionSeatPaymentApprovedConsumer.name);

  /**
   * Creates an instance of SessionSeatPaymentApprovedConsumer.
   *
   * @constructor
   * @param {SessionSeatsService} sessionSeatsService - Service for managing session seats
   */
  constructor(private readonly sessionSeatsService: SessionSeatsService) {}

  /**
   * Handles payment approved events from the payments microservice.
   *
   * @description
   * This method is triggered when a payment approved event is received. It processes
   * the event by delegating to the SessionSeatsService. If the session seat or its
   * reservation is not found, the error is silently handled to prevent event processing
   * failures. All other errors are re-thrown for proper error handling.
   *
   * @async
   * @param {PaymentApprovedMessage} payload - The payment approved event payload
   * @returns {Promise<void>} Resolves when the event is processed
   * @throws {Error} Re-throws any error that is not a SessionSeatReservationNotFoundException
   *                 or SessionSeatNotFoundException
   *
   * @example
   * // Event payload structure
   * const payload = {
   *   paymentId: '550e8400-e29b-41d4-a716-446655440000',
   *   userId: '550e8400-e29b-41d4-a716-446655440001',
   *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440002',
   * };
   */
  @EventPattern(PaymentsMessagesTopics.PAYMENT_APPROVED)
  async handlePaymentApproved(
    @Payload(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    payload: PaymentApprovedMessage,
  ) {
    this.logger.debug(
      `Received payment approved event with payload: ${JSON.stringify(payload)}`,
    );

    try {
      await this.sessionSeatsService.handlePaymentApproved(payload);
    } catch (error) {
      if (error instanceof SessionSeatReservationNotFoundException) {
        return;
      } else if (error instanceof SessionSeatNotFoundException) {
        return;
      }

      throw error;
    }
  }
}
