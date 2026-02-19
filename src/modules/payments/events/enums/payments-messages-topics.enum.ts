/**
 * @fileoverview Enum defining Kafka topic names for payments events.
 *
 * @description
 * This file contains the PaymentsMessagesTopics enum which centralises
 * the Kafka topic string identifiers used by the payments module producers
 * and consumers.
 *
 * @module payments-messages-topics.enum
 */

/**
 * Enum of Kafka topic names for payment-related events.
 *
 * @description
 * Defines the Kafka topic identifiers used to publish and consume
 * payment domain events. Producers emit messages to these topics and
 * consumers subscribe to them for downstream processing.
 *
 * @enum {string}
 *
 * @example
 * // Use a topic when emitting an event
 * this.kafkaClient.emit(PaymentsMessagesTopics.PAYMENT_CREATED, data);
 */
export enum PaymentsMessagesTopics {
  /**
   * Topic published when a new payment is created.
   *
   * @type {string}
   * @memberof PaymentsMessagesTopics
   *
   * @example
   * PaymentsMessagesTopics.PAYMENT_CREATED // 'payments.created'
   */
  PAYMENT_CREATED = 'payments.created',

  /**
   * Topic published when a payment expires without being completed.
   *
   * @type {string}
   * @memberof PaymentsMessagesTopics
   *
   * @example
   * PaymentsMessagesTopics.PAYMENT_EXPIRED // 'payments.expired'
   */
  PAYMENT_EXPIRED = 'payments.expired',

  /**
   * Topic published when a payment is successfully approved.
   *
   * @type {string}
   * @memberof PaymentsMessagesTopics
   *
   * @example
   * PaymentsMessagesTopics.PAYMENT_APPROVED // 'payments.approved'
   */
  PAYMENT_APPROVED = 'payments.approved',
}
