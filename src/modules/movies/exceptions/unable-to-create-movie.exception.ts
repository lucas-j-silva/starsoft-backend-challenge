/**
 * @fileoverview Exception thrown when a movie cannot be created in the database.
 *
 * @description
 * This file contains the UnableToCreateMovieException class which extends NestJS's
 * BadRequestException to provide specific error handling for movie creation failures.
 *
 * @module unable-to-create-movie.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from '../../../shared/exceptions/custom.exception';

/**
 * Custom exception thrown when a movie cannot be created in the database.
 * Extends CustomException to provide HTTP 400 responses.
 *
 * @extends {CustomException}
 *
 * @example
 * // Throw when unable to create movie
 * throw new UnableToCreateMovieException();
 */
export class UnableToCreateMovieException extends CustomException {
  /**
   * Logger instance for recording warning messages when the exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(UnableToCreateMovieException.name);

  /**
   * Creates a new UnableToCreateMovieException instance.
   */
  constructor() {
    const message = 'movies.UNABLE_TO_CREATE_MOVIE';

    super(message, 400);

    this.logger.warn(message);
  }
}
