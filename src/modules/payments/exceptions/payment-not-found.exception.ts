/**
 * @fileoverview Custom exception for payment not found scenarios.
 *
 * @description
 * This file contains the PaymentNotFoundException class which extends CustomException
 * to provide specific error handling for payment lookup failures, returning HTTP 404
 * responses with appropriate i18n error keys.
 *
 * @module payment-not-found.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from '../../../shared/exceptions/custom.exception';

/**
 * Exception thrown when a payment cannot be found in the database.
 * Extends CustomException to provide HTTP 404 responses.
 *
 * @class PaymentNotFoundException
 * @extends {CustomException}
 *
 * @example
 * // With payment ID
 * throw new PaymentNotFoundException('123e4567-e89b-12d3-a456-426614174000');
 * // Uses i18n key: payments.NOT_FOUND_WITH_ID
 *
 * @example
 * // Without payment ID
 * throw new PaymentNotFoundException();
 * // Uses i18n key: payments.NOT_FOUND
 */
export class PaymentNotFoundException extends CustomException {
  /**
   * Logger instance for logging warning messages when exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(PaymentNotFoundException.name);

  /**
   * Creates an instance of PaymentNotFoundException.
   *
   * @param {string} [id] - Optional payment ID that was not found.
   * When provided, uses i18n key 'payments.NOT_FOUND_WITH_ID'; otherwise uses 'payments.NOT_FOUND'.
   */
  constructor(id?: string) {
    const message = id ? 'payments.NOT_FOUND_WITH_ID' : 'payments.NOT_FOUND';

    super(message, 404, { id });

    this.logger.warn(message);
  }
}
