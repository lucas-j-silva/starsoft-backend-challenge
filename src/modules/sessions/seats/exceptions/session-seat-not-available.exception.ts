import { Logger } from '@nestjs/common';
import { CustomException } from '../../../../shared/exceptions/custom.exception';

/**
 * Exception thrown when a session seat is not available.
 *
 * @extends {CustomException}
 *
 * @example
 * throw new SessionSeatNotAvailableException('550e8400-e29b-41d4-a716-446655440000');
 * // Logs: "Session seat with id 550e8400-e29b-41d4-a716-446655440000 not available"
 *
 * @example
 * throw new SessionSeatNotAvailableException();
 * // Logs: "Session seat not available"
 */
export class SessionSeatNotAvailableException extends CustomException {
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
      ? 'sessions.SESSION_SEAT_NOT_AVAILABLE_WITH_ID'
      : 'sessions.SESSION_SEAT_NOT_AVAILABLE';

    super(message, 400, { id });
    this.logger.warn(
      id
        ? 'Session seat not available with id: ' + id
        : 'Session seat not available',
    );
  }
}
