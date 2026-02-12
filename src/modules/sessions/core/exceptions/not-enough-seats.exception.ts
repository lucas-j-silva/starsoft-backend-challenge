/**
 * @fileoverview Exception for insufficient seats in a session.
 *
 * @description
 * This file contains a custom exception that is thrown when a session
 * does not have enough seats to meet the minimum requirement.
 *
 * @module not-enough-seats.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from 'src/shared/exceptions/custom.exception';

/**
 * Exception thrown when a session does not have enough seats.
 *
 * @extends {CustomException}
 *
 * @description
 * This exception is used to indicate that a room does not have the minimum
 * required number of seats (16) to create a valid session. It logs a warning
 * message when instantiated.
 *
 * @example
 * if (roomSeats.length < MIN_SESSION_SEATS) {
 *   throw new NotEnoughSeatsException();
 * }
 */
export class NotEnoughSeatsException extends CustomException {
  /**
   * Logger instance for this exception class.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(NotEnoughSeatsException.name);

  /**
   * Creates an instance of NotEnoughSeatsException.
   *
   * @description
   * Initializes the exception with a predefined message and logs a warning.
   */
  constructor() {
    const message = 'sessions.NOT_ENOUGH_SEATS';

    super(message, 400);

    this.logger.warn(message);
  }
}
