/**
 * @fileoverview Base custom exception class for the application.
 *
 * @description
 * This file defines CustomException, which extends NestJS's HttpException to
 * add support for optional interpolation arguments used by the i18n translation
 * layer. All domain-specific exceptions in the codebase extend this class so
 * that the global {@link HttpExceptionFilter} can handle them uniformly.
 *
 * @module custom.exception
 */

import { HttpException } from '@nestjs/common';

/**
 * Base exception class that adds i18n interpolation argument support.
 *
 * @description
 * Extends NestJS's `HttpException` with an optional `args` map that is passed
 * to the `I18nService` when the exception is caught by
 * {@link HttpExceptionFilter}. The `message` field is treated as an i18n key
 * (e.g. `"errors.seat.not_found"`); the `args` field supplies the variables
 * that are interpolated into the translated string.
 *
 * All application-level exceptions should extend `CustomException` rather than
 * `HttpException` directly so that they are handled by the global filter.
 *
 * @class CustomException
 * @extends {HttpException}
 *
 * @example
 * // Define a domain-specific exception
 * export class SeatNotFoundException extends CustomException {
 *   constructor(seatId: string) {
 *     super('errors.seat.not_found', HttpStatus.NOT_FOUND, { seatId });
 *   }
 * }
 *
 * // Throw it from a service
 * throw new SeatNotFoundException('550e8400-e29b-41d4-a716-446655440000');
 */
export class CustomException extends HttpException {
  /**
   * Optional key-value pairs used for i18n message interpolation.
   *
   * @private
   * @readonly
   * @type {Record<string, unknown> | undefined}
   * @memberof CustomException
   */
  private readonly args?: Record<string, unknown>;

  /**
   * Creates an instance of CustomException.
   *
   * @param {string} message - An i18n translation key (e.g. `"errors.seat.not_found"`)
   *   that the global exception filter will resolve to a localised string.
   * @param {number} code - HTTP status code for the response (e.g. `404`).
   * @param {Record<string, unknown>} [args] - Optional interpolation variables
   *   passed to the i18n service when translating the message key.
   *
   * @example
   * throw new CustomException('errors.payment.failed', HttpStatus.PAYMENT_REQUIRED, {
   *   orderId: 'abc-123',
   * });
   */
  constructor(message: string, code: number, args?: Record<string, unknown>) {
    super(message, code);

    this.args = args;
  }

  /**
   * Returns the i18n interpolation arguments attached to this exception.
   *
   * @description
   * Called by {@link HttpExceptionFilter} to retrieve the `args` map before
   * passing it to `I18nService.t()`. Returns `undefined` if no args were
   * provided at construction time.
   *
   * @returns {Record<string, unknown> | undefined} The interpolation arguments,
   *   or `undefined` if none were supplied.
   *
   * @example
   * const exception = new CustomException('errors.seat.taken', 409, { seatId: '42' });
   * exception.getArgs(); // { seatId: '42' }
   */
  getArgs(): Record<string, unknown> | undefined {
    return this.args;
  }
}
