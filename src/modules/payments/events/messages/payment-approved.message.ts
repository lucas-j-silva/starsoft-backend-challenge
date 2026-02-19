/**
 * @fileoverview Message class for payment approved events.
 *
 * @description
 * This file contains the PaymentApprovedMessage class which represents
 * the payload structure for payment approval events sent via Kafka.
 *
 * @module payment-approved.message
 */

/**
 * Message class representing a payment approval event.
 *
 * @description
 * This class defines the structure of the message payload sent when
 * a payment has been successfully approved. It is used for event-driven
 * communication via Kafka messaging within the payments module.
 *
 * @class PaymentApprovedMessage
 *
 * @example
 * const message = new PaymentApprovedMessage({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   userId: '550e8400-e29b-41d4-a716-446655440001',
 *   amountInCents: 5000,
 *   expiresAt: new Date(Date.now() + 15 * 60 * 1000),
 *   approvedAt: new Date(),
 *   externalId: 'ext-ref-001',
 * });
 */
export class PaymentApprovedMessage {
  /**
   * The unique identifier of the payment.
   *
   * @type {string}
   * @memberof PaymentApprovedMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440000'
   */
  id: string;

  /**
   * The unique identifier of the user who initiated the payment.
   *
   * @type {string}
   * @memberof PaymentApprovedMessage
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440001'
   */
  userId: string;

  /**
   * The payment amount expressed in cents.
   *
   * @type {number}
   * @memberof PaymentApprovedMessage
   *
   * @example
   * 5000
   */
  amountInCents: number;

  /**
   * The timestamp when the payment expires, or null if it does not expire.
   *
   * @type {Date | null}
   * @memberof PaymentApprovedMessage
   *
   * @example
   * new Date('2024-01-15T19:45:00Z')
   */
  expiresAt: Date | null;

  /**
   * The timestamp when the payment was approved.
   *
   * @type {Date}
   * @memberof PaymentApprovedMessage
   *
   * @example
   * new Date('2024-01-15T19:35:00Z')
   */
  approvedAt: Date;

  /**
   * The external reference identifier for the payment, or null if not set.
   *
   * @type {string | null}
   * @memberof PaymentApprovedMessage
   *
   * @example
   * 'ext-ref-001'
   */
  externalId: string | null;

  /**
   * Creates an instance of PaymentApprovedMessage.
   *
   * @param {PaymentApprovedMessage} data - Data to initialize the message.
   */
  constructor(data: PaymentApprovedMessage) {
    Object.assign(this, data);
  }
}
