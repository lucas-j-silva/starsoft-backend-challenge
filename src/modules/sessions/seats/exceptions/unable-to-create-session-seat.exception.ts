/**
 * @fileoverview Exception thrown when a session seat cannot be created.
 *
 * @description
 * This file contains a custom exception class that extends NestJS's
 * BadRequestException. It is thrown when the system fails to create
 * a session seat record in the database.
 *
 * @module unable-to-create-session-seat.exception
 */

import { BadRequestException, Logger } from '@nestjs/common';

/**
 * Exception thrown when a session seat creation fails.
 *
 * @description
 * This exception is used in the SessionSeatsRepository when an insert
 * operation fails to return a valid session seat record. It logs a
 * warning message and returns a 400 Bad Request response to the client.
 *
 * @extends {BadRequestException}
 *
 * @example
 * // Throwing the exception when session seat creation fails
 * if (!sessionSeat) {
 *   throw new UnableToCreateSessionSeatException();
 * }
 */
export class UnableToCreateSessionSeatException extends BadRequestException {
  /**
   * Logger instance for this exception class.
   *
   * @private
   * @readonly
   */
  private readonly logger = new Logger(UnableToCreateSessionSeatException.name);

  /**
   * Creates an instance of UnableToCreateSessionSeatException.
   *
   * @description
   * Initializes the exception with a predefined error message,
   * calls the parent BadRequestException constructor, and logs
   * a warning message for debugging purposes.
   */
  constructor() {
    const message = 'Unable to create session seat';

    super(message);

    this.logger.warn(message);
  }
}
