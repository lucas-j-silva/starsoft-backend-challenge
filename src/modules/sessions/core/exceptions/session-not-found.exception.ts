/**
 * @fileoverview Exception thrown when a session cannot be found in the database.
 *
 * @description
 * This file contains the SessionNotFoundException class which extends NestJS's
 * NotFoundException to provide specific error handling for session lookup failures.
 *
 * @module session-not-found.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from 'src/shared/exceptions/custom.exception';

/**
 * Exception thrown when a session cannot be found in the database.
 *
 * @extends {CustomException}
 *
 * @example
 * throw new SessionNotFoundException('550e8400-e29b-41d4-a716-446655440000');
 * // Logs: "Session with id 550e8400-e29b-41d4-a716-446655440000 not found"
 *
 * @example
 * throw new SessionNotFoundException();
 * // Logs: "Session not found"
 */
export class SessionNotFoundException extends CustomException {
  /**
   * Logger instance for recording warning messages when the exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(SessionNotFoundException.name);

  /**
   * Creates an instance of SessionNotFoundException.
   *
   * @param {string} [id] - Optional session ID that was not found.
   *                        If provided, the error message will include the ID.
   *                        If omitted, a generic "Session not found" message is used.
   */
  constructor(id?: string) {
    const message = id ? 'sessions.NOT_FOUND_WITH_ID' : 'sessions.NOT_FOUND';

    super(message, 404, { id });

    this.logger.warn(
      id ? 'Session not found with id: ' + id : 'Session not found',
    );
  }
}
