/**
 * @fileoverview Custom exception for seat creation failures.
 *
 * @description
 * This file contains the UnableToCreateSeatException class which is thrown
 * when a seat cannot be created in the system, typically due to database
 * insertion failures or constraint violations.
 *
 * @module unable-to-create-seat.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from 'src/shared/exceptions/custom.exception';

/**
 * Exception thrown when a seat cannot be created.
 *
 * @description
 * This exception extends CustomException and is used to indicate
 * that a seat creation operation has failed. It automatically logs a warning
 * message when instantiated.
 *
 * @class UnableToCreateSeatException
 * @extends {CustomException}
 *
 * @example
 * // Throwing the exception when seat creation fails
 * if (!seat) {
 *   throw new UnableToCreateSeatException();
 * }
 */
export class UnableToCreateSeatException extends CustomException {
  /**
   * Logger instance for this exception class.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(UnableToCreateSeatException.name);

  /**
   * Creates an instance of UnableToCreateSeatException.
   *
   * @description
   * Initializes the exception with a predefined error message and
   * logs a warning to help with debugging and monitoring.
   *
   * @example
   * throw new UnableToCreateSeatException();
   */
  constructor() {
    const message = 'rooms.UNABLE_TO_CREATE_SEAT';

    super(message, 400);

    this.logger.warn(message);
  }
}
