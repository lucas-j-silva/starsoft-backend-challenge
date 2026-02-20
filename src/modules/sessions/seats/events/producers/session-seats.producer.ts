/**
 * @fileoverview Kafka producer for session seats events.
 *
 * @description
 * This file contains the SessionSeatsProducer class which is responsible
 * for publishing session seat-related events to Kafka topics. It handles
 * reservation creation, expiration, and seat release events.
 *
 * @module session-seats.producer
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SessionSeatsMessagesTopics } from '../enums';
import {
  ReservationCreatedMessage,
  ReservationExpiredMessage,
  SessionSeatReleasedMessage,
  SessionSeatReservationConflictMessage,
} from '../messages';

/**
 * Kafka producer service for session seats events.
 *
 * @description
 * This service is responsible for publishing session seat-related events
 * to Kafka topics. It initializes a Kafka client in producer-only mode
 * and provides methods to emit various seat-related events.
 *
 * @class SessionSeatsProducer
 * @decorator Injectable
 *
 * @example
 * // Inject and use the producer
 * constructor(private readonly sessionSeatsProducer: SessionSeatsProducer) {}
 *
 * // Send a reservation expired event
 * await this.sessionSeatsProducer.sendReservationExpiredEvent({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   createdAt: new Date(),
 *   userId: '550e8400-e29b-41d4-a716-446655440001',
 *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440002',
 *   expiresAt: new Date(),
 * });
 */
@Injectable()
export class SessionSeatsProducer {
  /**
   * The Kafka client instance used for producing messages.
   *
   * @private
   * @readonly
   * @type {ClientKafka}
   * @memberof SessionSeatsProducer
   */
  private readonly kafkaClient: ClientKafka;

  /**
   * Creates an instance of SessionSeatsProducer.
   *
   * @description
   * Initializes the Kafka client with producer-only mode configuration.
   * The client is configured to allow automatic topic creation and
   * connects to brokers specified in the KAFKA_BROKERS environment variable.
   *
   * @param {ConfigService} configService - NestJS configuration service for accessing environment variables.
   *
   * @example
   * // The producer is typically instantiated by NestJS dependency injection
   * const producer = new SessionSeatsProducer(configService);
   */
  constructor(private readonly configService: ConfigService) {
    this.kafkaClient = new ClientKafka({
      producerOnlyMode: true,
      producer: {
        allowAutoTopicCreation: true,
        retry: {
          initialRetryTime: 1500,
          retries: 8,
          maxRetryTime: 5000,
          factor: 2,
        },
      },
      client: {
        clientId: 'session-seats-producer-client',
        brokers: this.configService
          .getOrThrow<string>('KAFKA_BROKERS')
          .split(','),
      },
    });
  }

  /**
   * Sends a reservation expired event to Kafka.
   *
   * @description
   * Publishes a message to the RESERVATIONS_EXPIRED topic indicating
   * that a seat reservation has expired and is no longer valid.
   *
   * @async
   * @param {ReservationExpiredMessage} data - The reservation expiration event data.
   * @returns {Promise<void>} A promise that resolves when the message is sent.
   *
   * @example
   * await producer.sendReservationExpiredEvent({
   *   id: '550e8400-e29b-41d4-a716-446655440000',
   *   createdAt: new Date('2024-01-15T19:30:00Z'),
   *   userId: '550e8400-e29b-41d4-a716-446655440001',
   *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440002',
   *   expiresAt: new Date('2024-01-15T19:45:00Z'),
   * });
   */
  async sendReservationExpiredEvent(
    data: ReservationExpiredMessage,
  ): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit(
        SessionSeatsMessagesTopics.RESERVATIONS_EXPIRED,
        data,
      ),
    );
  }

  /**
   * Sends a reservation created event to Kafka.
   *
   * @description
   * Publishes a message to the RESERVATIONS_CREATED topic indicating
   * that a new seat reservation has been created.
   *
   * @async
   * @param {ReservationCreatedMessage} data - The reservation creation event data.
   * @returns {Promise<void>} A promise that resolves when the message is sent.
   *
   * @example
   * await producer.sendReservationCreatedEvent({
   *   id: '550e8400-e29b-41d4-a716-446655440000',
   *   createdAt: new Date('2024-01-15T19:30:00Z'),
   *   userId: '550e8400-e29b-41d4-a716-446655440001',
   *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440002',
   *   expiresAt: new Date('2024-01-15T19:45:00Z'),
   * });
   */
  async sendReservationCreatedEvent(
    data: ReservationCreatedMessage,
  ): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit(
        SessionSeatsMessagesTopics.RESERVATIONS_CREATED,
        data,
      ),
    );
  }

  /**
   * Sends a session seat released event to Kafka.
   *
   * @description
   * Publishes a message to the SESSION_SEAT_RELEASED topic indicating
   * that a session seat has been released and is now available.
   *
   * @async
   * @param {SessionSeatReleasedMessage} data - The session seat release event data.
   * @returns {Promise<void>} A promise that resolves when the message is sent.
   *
   * @example
   * await producer.sendSessionSeatReleasedEvent({
   *   id: '550e8400-e29b-41d4-a716-446655440000',
   *   releasedAt: new Date('2024-01-15T19:30:00Z'),
   * });
   */
  async sendSessionSeatReleasedEvent(
    data: SessionSeatReleasedMessage,
  ): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit(
        SessionSeatsMessagesTopics.SESSION_SEAT_RELEASED,
        data,
      ),
    );
  }

  /**
   * Sends a session seat reservation conflict event to Kafka.
   *
   * @description
   * Publishes a message to the SESSION_SEAT_RESERVATION_CONFLICT topic indicating
   * that a reservation conflict has occurred. This typically happens when a payment
   * is approved but the associated seat was already sold, resulting in a conflict
   * that requires the payment to be refunded.
   *
   * @async
   * @param {SessionSeatReservationConflictMessage} data - The reservation conflict event data.
   * @returns {Promise<void>} A promise that resolves when the message is sent.
   *
   * @example
   * await producer.sendSessionSeatReservationConflictEvent({
   *   reservationId: '550e8400-e29b-41d4-a716-446655440000',
   *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440001',
   *   userId: '550e8400-e29b-41d4-a716-446655440002',
   * });
   */
  async sendSessionSeatReservationConflictEvent(
    data: SessionSeatReservationConflictMessage,
  ): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit(
        SessionSeatsMessagesTopics.SESSION_SEAT_RESERVATION_CONFLICT,
        data,
      ),
    );
  }
}
