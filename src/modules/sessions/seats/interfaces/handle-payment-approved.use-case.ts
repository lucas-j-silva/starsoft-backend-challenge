/**
 * @fileoverview Interface for the Handle Payment Approved use case.
 *
 * @description
 * This file contains the interface for the Handle Payment Approved use case,
 * which is responsible for processing approved payment events and updating
 * session seat reservations accordingly.
 *
 * @module handle-payment-approved.use-case.interface
 */

import { PaymentApprovedMessage } from '../../../payments/events/messages';

/**
 * Interface for the use case responsible for handling approved payment events.
 *
 * @interface IHandlePaymentApprovedUseCase
 *
 * @example
 * class HandlePaymentApprovedUseCase implements IHandlePaymentApprovedUseCase {
 *   async execute(payload: PaymentApprovedMessage): Promise<void> {
 *     // Implementation
 *   }
 * }
 */
export interface IHandlePaymentApprovedUseCase {
  /**
   * Executes the handling of an approved payment event.
   *
   * @param {PaymentApprovedMessage} payload - The payment approved message containing payment details.
   * @returns {Promise<void>} A promise that resolves when the payment approval has been processed.
   *
   * @example
   * await handlePaymentApprovedUseCase.execute({
   *   paymentId: '550e8400-e29b-41d4-a716-446655440000',
   *   orderId: '660e8400-e29b-41d4-a716-446655440001',
   *   // ... other payment details
   * });
   */
  execute(payload: PaymentApprovedMessage): Promise<void>;
}
