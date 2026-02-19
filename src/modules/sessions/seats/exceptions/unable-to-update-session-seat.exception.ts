/**
 * @fileoverview Exception thrown when a session seat cannot be updated.
 *
 * @description
 * This file contains a custom exception class that extends the CustomException.
 * It is thrown when the system fails to update a session seat record in the database.
 *
 * @module unable-to-update-session-seat.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from '../../../../shared/exceptions/custom.exception';

/**
 * Exception thrown when a session seat update fails.
 *
 * @description
 * This exception is used in the SessionSeatsRepository when an update
 * operation fails to return a valid session seat record. It logs a
 * warning message and returns a 400 Bad Request response to the client.
 *
 * @extends {CustomException}
 *
 * @example
 * // Throw with default message
 * throw new UnableToUpdateSessionSeatException();
 *
 * @example
 * // Throw with custom message
 * throw new UnableToUpdateSessionSeatException('Custom error message');
 */
export class UnableToUpdateSessionSeatException extends CustomException {
  /**
   * Logger instance for this exception class.
   *
   * @private
   * @readonly
   */
  private readonly logger = new Logger(UnableToUpdateSessionSeatException.name);

  /**
   * Creates an instance of UnableToUpdateSessionSeatException.
   *
   * @description
   * Initializes the exception with either a custom message or a predefined
   * error message, calls the parent CustomException constructor, and logs
   * a warning message for debugging purposes.
   *
   * @param {string} [customMessage] - Optional custom error message.
   *                                   If not provided, defaults to 'sessions.UNABLE_TO_UPDATE_SESSION_SEAT'.
   */
  constructor(customMessage?: string) {
    const message = customMessage ?? 'sessions.UNABLE_TO_UPDATE_SESSION_SEAT';

    super(message, 400);

    this.logger.warn('Unable to update session seat');
  }
}
