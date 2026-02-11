/**
 * @fileoverview Exceptions for the Sessions module.
 *
 * @description
 * This file contains the exceptions for the Sessions module.
 *
 * @module unable-to-create-session.exception
 */

import { BadRequestException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

/**
 * Exception thrown when a session cannot be created.
 *
 * @extends {BadRequestException}
 *
 * @example
 * // Throw when unable to create session
 * throw new UnableToCreateSessionException();
 */
export class UnableToCreateSessionException extends BadRequestException {
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
    const message = 'Unable to create session';

    super(message);

    this.logger.warn(message);
  }
}
