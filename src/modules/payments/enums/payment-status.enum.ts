/**
 * @fileoverview Enum representing the lifecycle status of a payment.
 *
 * @description
 * This file defines the PaymentStatus enum which describes all possible states
 * a payment can be in throughout its lifecycle, from initial creation to final
 * resolution (approved or expired).
 *
 * @module payment-status.enum
 */

/**
 * Enum representing the possible statuses of a payment.
 *
 * @description
 * Defines the three states a payment can occupy during its lifecycle.
 * Payments begin as PENDING and transition to either APPROVED upon successful
 * confirmation or EXPIRED when the payment window elapses without confirmation.
 *
 * @enum {string}
 *
 * @example
 * // Checking a payment's status
 * if (payment.status === PaymentStatus.APPROVED) {
 *   // grant access or fulfill order
 * }
 *
 * @example
 * // Filtering for expired payments
 * const expired = payments.filter(p => p.status === PaymentStatus.EXPIRED);
 */
export enum PaymentStatus {
  /**
   * The payment has been created and is awaiting confirmation.
   * This is the initial state of every newly created payment.
   *
   * @type {string}
   * @memberof PaymentStatus
   */
  PENDING = 'PENDING',

  /**
   * The payment has been confirmed and successfully processed.
   * Transitions from PENDING after the payment is explicitly approved.
   *
   * @type {string}
   * @memberof PaymentStatus
   */
  APPROVED = 'APPROVED',

  /**
   * The payment window has elapsed without the payment being approved.
   * Transitions from PENDING when the expiresAt timestamp is surpassed.
   *
   * @type {string}
   * @memberof PaymentStatus
   */
  EXPIRED = 'EXPIRED',
}
