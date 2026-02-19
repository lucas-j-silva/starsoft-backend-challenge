/**
 * @fileoverview Kafka consumer for session seat reservation conflict events.
 *
 * @description
 * This file contains the consumer responsible for handling session seat
 * reservation conflict events from the Kafka message broker. When a payment
 * is approved but the associated seat was already sold, this consumer
 * processes the conflict by triggering the refund workflow.
 *
 * @module session-seat-reservation-conflict.consumer
 */

import { Controller, Logger, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SessionSeatsMessagesTopics } from '../../../sessions/seats/events/enums';
import { SessionSeatReservationConflictMessage } from '../../../sessions/seats/events/messages';
import { PaymentsService } from '../../services/payments.service';
import { PaymentNotFoundException } from '../../exceptions';

/**
 * Kafka consumer for handling session seat reservation conflict events.
 *
 * @description
 * This consumer listens to the SESSION_SEAT_RESERVATION_CONFLICT topic and
 * processes events when a payment was approved but the associated seat was
 * already sold. It delegates the conflict handling to the payments service,
 * which initiates the refund process.
 *
 * @class PaymentsSessionSeatReservationConflictConsumer
 *
 * @example
 * // The consumer automatically handles incoming Kafka messages:
 * // Topic: SESSION_SEAT_RESERVATION_CONFLICT
 * // Payload: { reservationId, sessionSeatId, userId }
 */
@Controller()
export class PaymentsSessionSeatReservationConflictConsumer {
  /**
   * Logger instance for this consumer.
   *
   * @private
   * @readonly
   */
  private readonly logger = new Logger(
    PaymentsSessionSeatReservationConflictConsumer.name,
  );

  /**
   * Creates an instance of PaymentsSessionSeatReservationConflictConsumer.
   *
   * @param {PaymentsService} paymentsService - Service for handling payment operations.
   */
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Handles session seat reservation conflict events from Kafka.
   *
   * @description
   * Processes incoming conflict events by delegating to the payments service.
   * If the associated payment is not found, the error is silently ignored
   * (idempotent behavior). Any other errors are re-thrown for proper error
   * handling by the message broker.
   *
   * @async
   * @param {SessionSeatReservationConflictMessage} payload - The conflict event data containing
   *   the reservation ID, session seat ID, and user ID involved in the conflict.
   * @returns {Promise<void>} A promise that resolves when the conflict has been handled.
   * @throws {Error} Re-throws any error that is not a PaymentNotFoundException.
   *
   * @example
   * // Automatically invoked when a message is received on the topic:
   * // {
   * //   reservationId: '550e8400-e29b-41d4-a716-446655440000',
   * //   sessionSeatId: '550e8400-e29b-41d4-a716-446655440001',
   * //   userId: '550e8400-e29b-41d4-a716-446655440002'
   * // }
   */
  @EventPattern(SessionSeatsMessagesTopics.SESSION_SEAT_RESERVATION_CONFLICT)
  async handleSessionSeatReservationConflict(
    @Payload(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    payload: SessionSeatReservationConflictMessage,
  ): Promise<void> {
    this.logger.debug(
      `Received session seat reservation conflict event with payload: ${JSON.stringify(payload)}`,
    );

    try {
      await this.paymentsService.handleSessionSeatReservationConflict(payload);
    } catch (error) {
      if (error instanceof PaymentNotFoundException) {
        return;
      }

      throw error;
    }
  }
}
