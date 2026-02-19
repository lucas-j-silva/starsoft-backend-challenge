/**
 * @fileoverview Kafka consumer for reservation created events in the payments module.
 *
 * @description
 * This file contains the PaymentsReservationCreatedConsumer class which listens
 * to reservation creation events from the session seats Kafka topic and delegates
 * payment processing to the PaymentsService.
 *
 * @module reservation-created.consumer
 */

import { Controller, Logger, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReservationCreatedMessage } from '../../../sessions/seats/events/messages';
import { SessionSeatsMessagesTopics } from '../../../sessions/seats/events/enums';
import { PaymentsService } from '../../services/payments.service';

/**
 * Kafka consumer controller for reservation created events.
 *
 * @description
 * Listens to the RESERVATIONS_CREATED Kafka topic and processes incoming
 * reservation creation payloads by delegating to the PaymentsService.
 * Validates and transforms each incoming message before handling.
 *
 * @class PaymentsReservationCreatedConsumer
 * @decorator Controller
 *
 * @example
 * // The consumer is automatically registered by NestJS microservice configuration.
 * // It responds to messages on the SessionSeatsMessagesTopics.RESERVATIONS_CREATED topic.
 */
@Controller()
export class PaymentsReservationCreatedConsumer {
  /**
   * Logger instance for the consumer.
   *
   * @private
   * @readonly
   */
  private readonly logger = new Logger(PaymentsReservationCreatedConsumer.name);

  /**
   * Creates an instance of PaymentsReservationCreatedConsumer.
   *
   * @param {PaymentsService} paymentsService - Service responsible for handling payment business logic.
   *
   * @example
   * // The consumer is typically instantiated by NestJS dependency injection
   * const consumer = new PaymentsReservationCreatedConsumer(paymentsService);
   */
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Handles an incoming reservation created event from Kafka.
   *
   * @description
   * This method is triggered when a message is published to the
   * RESERVATIONS_CREATED topic. It validates and transforms the incoming
   * payload, logs the event, and delegates processing to the PaymentsService.
   *
   * @async
   * @param payload - The validated reservation creation message payload.
   * @returns A promise that resolves when the event has been processed.
   *
   * @example
   * // This method is automatically invoked by the Kafka consumer
   * // when a message is received on the RESERVATIONS_CREATED topic:
   * // {
   * //   id: '550e8400-e29b-41d4-a716-446655440000',
   * //   sessionId: '550e8400-e29b-41d4-a716-446655440003',
   * //   userId: '550e8400-e29b-41d4-a716-446655440001',
   * //   sessionSeatId: '550e8400-e29b-41d4-a716-446655440002',
   * //   createdAt: new Date(),
   * //   expiresAt: new Date(Date.now() + 15 * 60 * 1000),
   * // }
   */
  @EventPattern(SessionSeatsMessagesTopics.RESERVATIONS_CREATED)
  async handleReservationCreated(
    @Payload(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    payload: ReservationCreatedMessage,
  ): Promise<void> {
    this.logger.debug(
      `Received reservation created event with payload: ${JSON.stringify(payload)}`,
    );

    await this.paymentsService.handleReservationCreated(payload);
  }
}
