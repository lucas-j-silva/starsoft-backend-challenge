/**
 * @fileoverview Custom exception for payment approval failure scenarios.
 *
 * @description
 * This file contains the UnableToApprovePaymentException class which extends CustomException
 * to provide specific error handling when a payment cannot be approved, returning HTTP 400
 * responses with either a custom message or the default i18n error key.
 *
 * @module unable-to-approve-payment.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from '../../../shared/exceptions/custom.exception';

/**
 * Exception thrown when a payment cannot be approved due to a processing failure.
 * Extends CustomException to provide HTTP 400 responses.
 *
 * @class UnableToApprovePaymentException
 * @extends {CustomException}
 *
 * @example
 * // Without a custom message — uses default i18n key
 * throw new UnableToApprovePaymentException();
 * // Uses i18n key: payments.UNABLE_TO_APPROVE_PAYMENT
 *
 * @example
 * // With a descriptive custom message
 * throw new UnableToApprovePaymentException('Payment is already approved');
 * // Uses the provided string as the error message
 */
export class UnableToApprovePaymentException extends CustomException {
  /**
   * Logger instance for logging warning messages when exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(UnableToApprovePaymentException.name);

  /**
   * Creates an instance of UnableToApprovePaymentException.
   *
   * @param {string} [customMessage] - Optional custom error message.
   * When omitted, defaults to the i18n key 'payments.UNABLE_TO_APPROVE_PAYMENT'.
   */
  constructor(customMessage?: string) {
    const message = customMessage ?? 'payments.UNABLE_TO_APPROVE_PAYMENT';

    super(message, 400);

    this.logger.warn(message);
  }
}
