/**
 * @fileoverview Exception thrown when a session seat cannot be found in the database.
 *
 * @description
 * This file contains the SessionSeatNotFoundException class which extends NestJS's
 * NotFoundException to provide specific error handling for session seat lookup failures.
 *
 * @module session-seat-not-found.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from 'src/shared/exceptions/custom.exception';

/**
 * Exception thrown when a session seat cannot be found in the database.
 *
 * @extends {CustomException}
 *
 * @example
 * throw new SessionSeatNotFoundException('550e8400-e29b-41d4-a716-446655440000');
 * // Logs: "Session seat with id 550e8400-e29b-41d4-a716-446655440000 not found"
 *
 * @example
 * throw new SessionSeatNotFoundException();
 * // Logs: "Session seat not found"
 */
export class SessionSeatNotFoundException extends CustomException {
  /**
   * Logger instance for recording warning messages when the exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(SessionSeatNotFoundException.name);

  /**
   * Creates an instance of SessionSeatNotFoundException.
   *
   * @param {string} [id] - Optional session seat ID that was not found.
   *                        If provided, the error message will include the ID.
   *                        If omitted, a generic "Session seat not found" message is used.
   */
  constructor(id?: string) {
    const message = id
      ? 'sessions.SESSION_SEAT_NOT_FOUND_WITH_ID'
      : 'sessions.SESSION_SEAT_NOT_FOUND';

    super(message, 404, { id });

    this.logger.warn(
      id ? 'Session seat not found with id: ' + id : 'Session seat not found',
    );
  }
}
