/**
 * @fileoverview Exceptions for the Sessions module.
 *
 * @description
 * This file contains the exceptions for the Sessions module.
 *
 * @module unable-to-create-session.exception
 */

import { CustomException } from 'src/shared/exceptions/custom.exception';
import { Logger } from '@nestjs/common';

/**
 * Exception thrown when a session cannot be created.
 *
 * @extends {CustomException}
 *
 * @example
 * // Throw when unable to create session
 * throw new UnableToCreateSessionException();
 */
export class UnableToCreateSessionException extends CustomException {
  /**
   * Logger instance for recording warning messages when the exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(UnableToCreateSessionException.name);

  /**
   * Creates an instance of UnableToCreateSessionException.
   *
   * @description
   * Initializes the exception with a predefined error message and
   * logs a warning to help with debugging and monitoring.
   */
  constructor() {
    const message = 'sessions.UNABLE_TO_CREATE_SESSION';

    super(message, 400);

    this.logger.warn(message);
  }
}
