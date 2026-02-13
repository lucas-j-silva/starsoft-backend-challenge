import { Logger } from '@nestjs/common';
import { CustomException } from '../../../shared/exceptions/custom.exception';

/**
 * Custom exception thrown when a movie cannot be found in the database.
 * Extends CustomException to provide HTTP 404 responses.
 *
 * @extends {CustomException}
 *
 * @example
 * // Throw with a specific movie ID
 * throw new MovieNotFoundException('123e4567-e89b-12d3-a456-426614174000');
 *
 * @example
 * // Throw without an ID
 * throw new MovieNotFoundException();
 */
export class MovieNotFoundException extends CustomException {
  /**
   * Logger instance for recording warning messages when the exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(MovieNotFoundException.name);

  /**
   * Creates a new MovieNotFoundException instance.
   *
   * @param {string} [id] - Optional movie ID that was not found.
   *                        If provided, the error message will include the ID.
   *                        If omitted, a generic "Movie not found" message is used.
   */
  constructor(id?: string) {
    const message = id ? 'movies.NOT_FOUND_WITH_ID' : 'movies.NOT_FOUND';

    super(message, 404, { id });

    this.logger.warn(id ? 'Movie not found with id: ' + id : 'Movie not found');
  }
}
