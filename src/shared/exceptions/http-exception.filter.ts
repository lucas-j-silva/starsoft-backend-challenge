/**
 * @fileoverview Global NestJS exception filter for CustomException instances.
 *
 * @description
 * This file contains HttpExceptionFilter, which is registered globally and
 * intercepts every {@link CustomException} thrown anywhere in the application.
 * It resolves the exception's i18n message key through `I18nService`, then
 * sends a standardized JSON error response.
 *
 * @module http-exception.filter
 */

import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Response } from 'express';
import { CustomException } from './custom.exception';

/**
 * Global exception filter that handles {@link CustomException} instances.
 *
 * @description
 * Decorated with `@Catch(CustomException)` so NestJS routes only
 * `CustomException` (and its subclasses) through this filter. For each caught
 * exception the filter:
 *
 * 1. Reads the exception's message (treated as an i18n key) and its optional
 *    interpolation `args`.
 * 2. Translates the key via `I18nService.t()`, falling back to the raw key if
 *    no translation is found.
 * 3. Sends an HTTP response with the shape
 *    `{ message, statusCode, error }`.
 *
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter<CustomException>}
 * @decorator Catch(CustomException)
 *
 * @example
 * // Register globally in main.ts
 * app.useGlobalFilters(new HttpExceptionFilter(i18nService));
 *
 * // Or via APP_FILTER in a module
 * {
 *   provide: APP_FILTER,
 *   useClass: HttpExceptionFilter,
 * }
 */
@Catch(CustomException)
export class HttpExceptionFilter implements ExceptionFilter<CustomException> {
  /**
   * Creates an instance of HttpExceptionFilter.
   *
   * @param {I18nService} i18n - The NestJS i18n service used to translate
   *   exception message keys into localized strings.
   */
  constructor(private readonly i18n: I18nService) {}

  /**
   * Handles a caught {@link CustomException} and sends the translated error response.
   *
   * @description
   * Switches to the HTTP context, retrieves the Express `Response` object, and
   * performs i18n translation of the exception message before sending the JSON
   * error body. Non-`CustomException` errors are ignored (the guard `instanceof`
   * check ensures safety even if the filter were applied more broadly).
   *
   * @async
   * @param {HttpException} exception - The intercepted exception. In practice
   *   always a {@link CustomException} due to the `@Catch` decorator.
   * @param {ArgumentsHost} host - NestJS arguments host providing access to the
   *   underlying HTTP request/response context.
   * @returns {Promise<void>} Resolves once the response has been sent.
   *
   * @example
   * // This is invoked automatically by NestJS when a CustomException is thrown.
   * // The caller receives a response such as:
   * // HTTP 404
   * // { "message": "Seat not found", "statusCode": 404, "error": "SeatNotFoundException" }
   */
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionMessage = exception.message;

    if (exception instanceof CustomException) {
      const exceptionArgs = exception.getArgs();
      const statusCode = exception.getStatus();

      const i18nMessage = await this.i18n.t(exceptionMessage, {
        defaultValue: exceptionMessage,
        args: exceptionArgs,
      });

      response.status(statusCode).send({
        message: i18nMessage,
        statusCode: statusCode,
        error: exception.name,
      });
    }
  }
}
