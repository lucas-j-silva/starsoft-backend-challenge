/**
 * @fileoverview Kafka producer for payments events.
 *
 * @description
 * This file contains the PaymentsProducer class which is responsible
 * for publishing payment-related events to Kafka topics. It handles
 * payment creation, approval, and expiration events.
 *
 * @module payments.producer
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaymentsMessagesTopics } from '../enums/payments-messages-topics.enum';
import {
  PaymentApprovedMessage,
  PaymentCreatedMessage,
  PaymentExpiredMessage,
} from '../messages';

/**
 * Kafka producer service for payments events.
 *
 * @description
 * This service is responsible for publishing payment-related events
 * to Kafka topics. It initializes a Kafka client in producer-only mode
 * and provides methods to emit various payment-related events.
 *
 * @class PaymentsProducer
 * @decorator Injectable
 *
 * @example
 * // Inject and use the producer
 * constructor(private readonly paymentsProducer: PaymentsProducer) {}
 *
 * // Send a payment created event
 * await this.paymentsProducer.sendPaymentCreatedEvent({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   userId: '550e8400-e29b-41d4-a716-446655440001',
 *   amountInCents: 5000,
 *   expiresAt: new Date(),
 *   externalId: null,
 * });
 */
@Injectable()
export class PaymentsProducer {
  /**
   * The Kafka client instance used for producing messages.
   *
   * @private
   * @readonly
   * @type {ClientKafka}
   * @memberof PaymentsProducer
   */
  private readonly kafkaClient: ClientKafka;

  /**
   * Creates an instance of PaymentsProducer.
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
   * const producer = new PaymentsProducer(configService);
   */
  constructor(private readonly configService: ConfigService) {
    this.kafkaClient = new ClientKafka({
      producerOnlyMode: true,
      producer: {
        allowAutoTopicCreation: true,
      },
      client: {
        clientId: 'payments-producer-client',
        brokers: this.configService
          .getOrThrow<string>('KAFKA_BROKERS')
          .split(','),
        retry: {
          initialRetryTime: 1500,
          retries: 8,
          maxRetryTime: 5000,
          factor: 2,
        },
      },
    });
  }

  /**
   * Sends a payment created event to Kafka.
   *
   * @description
   * Publishes a message to the PAYMENT_CREATED topic indicating
   * that a new payment has been created and is awaiting processing.
   *
   * @async
   * @param data - The payment creation event data.
   * @returns A promise that resolves when the message is sent.
   *
   * @example
   * await producer.sendPaymentCreatedEvent({
   *   id: '550e8400-e29b-41d4-a716-446655440000',
   *   userId: '550e8400-e29b-41d4-a716-446655440001',
   *   amountInCents: 5000,
   *   expiresAt: new Date('2024-01-15T19:45:00Z'),
   *   externalId: null,
   * });
   */
  async sendPaymentCreatedEvent(data: PaymentCreatedMessage): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit(PaymentsMessagesTopics.PAYMENT_CREATED, data),
    );
  }

  /**
   * Sends a payment approved event to Kafka.
   *
   * @description
   * Publishes a message to the PAYMENT_APPROVED topic indicating
   * that a payment has been successfully approved.
   *
   * @async
   * @param data - The payment approval event data.
   * @returns A promise that resolves when the message is sent.
   *
   * @example
   * await producer.sendPaymentApprovedEvent({
   *   id: '550e8400-e29b-41d4-a716-446655440000',
   *   userId: '550e8400-e29b-41d4-a716-446655440001',
   *   amountInCents: 5000,
   *   expiresAt: new Date('2024-01-15T19:45:00Z'),
   *   approvedAt: new Date('2024-01-15T19:35:00Z'),
   *   externalId: 'ext-ref-001',
   * });
   */
  async sendPaymentApprovedEvent(data: PaymentApprovedMessage): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit(PaymentsMessagesTopics.PAYMENT_APPROVED, data),
    );
  }

  /**
   * Sends a payment expired event to Kafka.
   *
   * @description
   * Publishes a message to the PAYMENT_EXPIRED topic indicating
   * that a payment has expired without being completed.
   *
   * @async
   * @param data - The payment expiration event data.
   * @returns A promise that resolves when the message is sent.
   *
   * @example
   * await producer.sendPaymentExpiredEvent({
   *   id: '550e8400-e29b-41d4-a716-446655440000',
   *   userId: '550e8400-e29b-41d4-a716-446655440001',
   *   amountInCents: 5000,
   *   expiresAt: new Date('2024-01-15T19:45:00Z'),
   *   externalId: null,
   *   expiredAt: new Date('2024-01-15T19:46:00Z'),
   * });
   */
  async sendPaymentExpiredEvent(data: PaymentExpiredMessage): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit(PaymentsMessagesTopics.PAYMENT_EXPIRED, data),
    );
  }
}
