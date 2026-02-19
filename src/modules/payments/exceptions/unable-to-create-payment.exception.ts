/**
 * @fileoverview Custom exception for payment creation failure scenarios.
 *
 * @description
 * This file contains the UnableToCreatePaymentException class which extends CustomException
 * to provide specific error handling when a payment cannot be created, returning HTTP 400
 * responses with the appropriate i18n error key.
 *
 * @module unable-to-create-payment.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from '../../../shared/exceptions/custom.exception';

/**
 * Exception thrown when a payment cannot be created due to a processing failure.
 * Extends CustomException to provide HTTP 400 responses.
 *
 * @class UnableToCreatePaymentException
 * @extends {CustomException}
 *
 * @example
 * // Throwing when payment creation fails
 * throw new UnableToCreatePaymentException();
 * // Uses i18n key: payments.UNABLE_TO_CREATE_PAYMENT
 */
export class UnableToCreatePaymentException extends CustomException {
  /**
   * Logger instance for logging warning messages when exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(UnableToCreatePaymentException.name);

  /**
   * Creates an instance of UnableToCreatePaymentException.
   * Always uses the i18n key 'payments.UNABLE_TO_CREATE_PAYMENT' and returns HTTP 400.
   */
  constructor() {
    const message = 'payments.UNABLE_TO_CREATE_PAYMENT';

    super(message, 400);

    this.logger.warn(message);
  }
}
