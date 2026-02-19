/**
 * @fileoverview Message class for payment created events.
 *
 * @description
 * This file contains the PaymentCreatedMessage class which represents
 * the payload structure for payment creation events sent via Kafka.
 *
 * @module payment-created.message
 */

/**
 * Message class representing a payment creation event.
 *
 * @description
 * This class defines the structure of the message payload sent when
 * a new payment is created. It is used for event-driven communication
 * via Kafka messaging within the payments module.
 *
 * @class PaymentCreatedMessage
 *
 * @example
 * const message = new PaymentCreatedMessage({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   userId: '550e8400-e29b-41d4-a716-446655440001',
 *   amountInCents: 5000,
 *   expiresAt: new Date(Date.now() + 15 * 60 * 1000),
 *   externalId: null,
 * });
 */
export class PaymentCreatedMessage {
  /**
   * The unique identifier of the payment.
   *
   * @type {string}
   * @memberof PaymentCreatedMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440000'
   */
  id: string;

  /**
   * The unique identifier of the user who initiated the payment.
   *
   * @type {string}
   * @memberof PaymentCreatedMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440001'
   */
  userId: string;

  /**
   * The payment amount expressed in cents.
   *
   * @type {number}
   * @memberof PaymentCreatedMessage
   *
   * @example
   * 5000
   */
  amountInCents: number;

  /**
   * The timestamp when the payment expires, or null if it does not expire.
   *
   * @type {Date | null}
   * @memberof PaymentCreatedMessage
   *
   * @example
   * new Date('2024-01-15T19:45:00Z')
   */
  expiresAt: Date | null;

  /**
   * The external reference identifier for the payment, or null if not set.
   *
   * @type {string | null}
   * @memberof PaymentCreatedMessage
   *
   * @example
   * 'ext-ref-001'
   */
  externalId: string | null;

  /**
   * Creates an instance of PaymentCreatedMessage.
   *
   * @param {PaymentCreatedMessage} data - Data to initialize the message.
   */
  constructor(data: PaymentCreatedMessage) {
    Object.assign(this, data);
  }
}
