/**
 * @fileoverview Exception thrown when a session seat cannot be reserved.
 *
 * @description
 * This file contains a custom exception class that extends NestJS's
 * ServiceUnavailableException. It is thrown when the system fails to reserve
 * a session seat, typically due to service unavailability or resource constraints.
 *
 * @module unable-to-reserve-session-seat.exception
 */

import { Logger, ServiceUnavailableException } from '@nestjs/common';

/**
 * Exception thrown when a session seat reservation fails.
 *
 * @description
 * This exception is used when the system is unable to reserve a session seat.
 * It logs a warning message and returns a 503 Service Unavailable response to the client.
 *
 * @extends {ServiceUnavailableException}
 *
 * @example
 * // Throw with default message
 * throw new UnableToReserveSessionSeatException();
 *
 * @example
 * // Throw with custom message
 * throw new UnableToReserveSessionSeatException('Seat reservation temporarily unavailable');
 */
export class UnableToReserveSessionSeatException extends ServiceUnavailableException {
  /**
   * Logger instance for this exception class.
   *
   * @private
   * @readonly
   */
  private readonly logger = new Logger(
    UnableToReserveSessionSeatException.name,
  );

  /**
   * Creates an instance of UnableToReserveSessionSeatException.
   *
   * @description
   * Initializes the exception with either a custom message or a predefined
   * error message, calls the parent ServiceUnavailableException constructor,
   * and logs a warning message for debugging purposes.
   *
   * @param {string} [customMessage] - Optional custom error message.
   *                                   If not provided, defaults to 'sessions.UNABLE_TO_RESERVE_SESSION_SEAT'.
   */
  constructor(customMessage?: string) {
    const message = customMessage ?? 'sessions.UNABLE_TO_RESERVE_SESSION_SEAT';

    super(message);

    this.logger.warn(message);
  }
}
