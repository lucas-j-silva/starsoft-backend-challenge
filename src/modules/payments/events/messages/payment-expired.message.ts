/**
 * @fileoverview Message class for payment expired events.
 *
 * @description
 * This file contains the PaymentExpiredMessage class which represents
 * the payload structure for payment expiration events sent via Kafka.
 *
 * @module payment-expired.message
 */

/**
 * Message class representing a payment expiration event.
 *
 * @description
 * This class defines the structure of the message payload sent when
 * a payment has expired without being completed. It is used for event-driven
 * communication via Kafka messaging within the payments module.
 *
 * @class PaymentExpiredMessage
 *
 * @example
 * const message = new PaymentExpiredMessage({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   userId: '550e8400-e29b-41d4-a716-446655440001',
 *   amountInCents: 5000,
 *   expiresAt: new Date('2024-01-15T19:45:00Z'),
 *   externalId: null,
 *   expiredAt: new Date('2024-01-15T19:46:00Z'),
 * });
 */
export class PaymentExpiredMessage {
  /**
   * The unique identifier of the payment.
   *
   * @type {string}
   * @memberof PaymentExpiredMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440000'
   */
  id: string;

  /**
   * The unique identifier of the user who initiated the payment.
   *
   * @type {string}
   * @memberof PaymentExpiredMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440001'
   */
  userId: string;

  /**
   * The payment amount expressed in cents.
   *
   * @type {number}
   * @memberof PaymentExpiredMessage
   *
   * @example
   * 5000
   */
  amountInCents: number;

  /**
   * The timestamp when the payment was scheduled to expire, or null if not set.
   *
   * @type {Date | null}
   * @memberof PaymentExpiredMessage
   *
   * @example
   * new Date('2024-01-15T19:45:00Z')
   */
  expiresAt: Date | null;

  /**
   * The external reference identifier for the payment, or null if not set.
   *
   * @type {string | null}
   * @memberof PaymentExpiredMessage
   *
   * @example
   * 'ext-ref-001'
   */
  externalId: string | null;

  /**
   * The timestamp when the payment was marked as expired.
   *
   * @type {Date}
   * @memberof PaymentExpiredMessage
   *
   * @example
   * new Date('2024-01-15T19:46:00Z')
   */
  expiredAt: Date;

  /**
   * Creates an instance of PaymentExpiredMessage.
   *
   * @param {PaymentExpiredMessage} data - Data to initialize the message.
   */
  constructor(data: PaymentExpiredMessage) {
    Object.assign(this, data);
  }
}
