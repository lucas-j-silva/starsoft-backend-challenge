import { BadRequestException, Logger } from '@nestjs/common';

/**
 * Exception thrown when a session seat is not available.
 *
 * @extends {BadRequestException}
 *
 * @example
 * throw new SessionSeatNotAvailableException('550e8400-e29b-41d4-a716-446655440000');
 * // Logs: "Session seat with id 550e8400-e29b-41d4-a716-446655440000 not available"
 *
 * @example
 * throw new SessionSeatNotAvailableException();
 * // Logs: "Session seat not available"
 */
export class SessionSeatNotAvailableException extends BadRequestException {
  /**
   * Logger instance for this exception class.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(SessionSeatNotAvailableException.name);

  /**
   * Creates an instance of SessionSeatNotAvailableException.
   *
   * @description
   * Initializes the exception with a predefined error message and logs a warning.
   */
  constructor(id?: string) {
    const message = id
      ? `Session seat with id ${id} not available`
      : 'Session seat not available';

    super(message);
    this.logger.warn(message);
  }
}
