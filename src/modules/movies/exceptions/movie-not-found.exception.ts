import { Logger, NotFoundException } from '@nestjs/common';

/**
 * Custom exception thrown when a movie cannot be found in the database.
 * Extends NestJS's NotFoundException to provide HTTP 404 responses.
 *
 * @extends {NotFoundException}
 *
 * @example
 * // Throw with a specific movie ID
 * throw new MovieNotFoundException('123e4567-e89b-12d3-a456-426614174000');
 *
 * @example
 * // Throw without an ID
 * throw new MovieNotFoundException();
 */
export class MovieNotFoundException extends NotFoundException {
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
    const message = id ? `Movie with id ${id} not found` : 'Movie not found';

    super(message);

    this.logger.warn(message);
  }
}
