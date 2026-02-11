/**
 * @fileoverview Exception thrown when a session seat reservation cannot be created.
 *
 * @description
 * This file contains a custom exception class that extends NestJS's
 * BadRequestException. It is thrown when the system fails to create
 * a session seat reservation record in the database.
 * @module unable-to-create-session-seat-reservation.exception
 */
import { BadRequestException, Logger } from '@nestjs/common';

/**
 * Exception thrown when a session seat reservation cannot be created.
 *
 * @extends {BadRequestException}
 *
 * @example
 * // Throw when unable to create session seat reservation
 * throw new UnableToCreateSessionSeatReservationException();
 */
export class UnableToCreateSessionSeatReservationException extends BadRequestException {
  /**
   * Logger instance for this exception class.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(
    UnableToCreateSessionSeatReservationException.name,
  );

  /**
   * Creates an instance of UnableToCreateSessionSeatReservationException.
   *
   * @description
   * Initializes the exception with a predefined error message and logs a warning.
   */
  constructor() {
    const message = 'Unable to create session seat reservation';

    super(message);

    this.logger.warn(message);
  }
}
