/**
 * @fileoverview Exceptions for the Sessions module.
 *
 * @description
 * This file contains the exceptions for the Sessions module.
 *
 * @module unable-to-update-session.exception
 */

import { BadRequestException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

/**
 * Exception thrown when a session cannot be updated.
 *
 * @extends {BadRequestException}
 *
 * @example
 * // Throw when unable to update session
 * throw new UnableToUpdateSessionException();
 */
export class UnableToUpdateSessionException extends BadRequestException {
  /**
   * Logger instance for recording warning messages when the exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(UnableToUpdateSessionException.name);

  /**
   * Creates an instance of UnableToUpdateSessionException.
   *
   * @description
   * Initializes the exception with a predefined error message and
   * logs a warning to help with debugging and monitoring.
   */
  constructor(customMessage?: string) {
    const message = customMessage ?? 'Unable to update session';

    super(message);

    this.logger.warn(message);
  }
}
