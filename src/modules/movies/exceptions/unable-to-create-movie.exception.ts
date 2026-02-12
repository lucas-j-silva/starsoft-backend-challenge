import { BadRequestException, Logger } from '@nestjs/common';

/**
 * Custom exception thrown when a movie cannot be created in the database.
 * Extends NestJS's BadRequestException to provide HTTP 400 responses.
 *
 * @extends {BadRequestException}
 *
 * @example
 * // Throw when unable to create movie
 * throw new UnableToCreateMovieException();
 */
export class UnableToCreateMovieException extends BadRequestException {
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

    super(message);

    this.logger.warn(message);
  }
}
