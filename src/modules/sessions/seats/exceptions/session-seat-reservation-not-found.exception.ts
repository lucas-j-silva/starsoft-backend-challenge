/**
 * @fileoverview Exception thrown when a session seat reservation cannot be found.
 *
 * @description
 * This file contains the SessionSeatReservationNotFoundException class which extends NestJS's
 * NotFoundException to provide specific error handling for session seat reservation lookup failures.
 *
 * @module session-seat-reservation-not-found.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from '../../../../shared/exceptions/custom.exception';

/**
 * Exception thrown when a session seat reservation cannot be found.
 *
 * @extends {CustomException}
 *
 * @example
 * // Throw without ID
 * throw new SessionSeatReservationNotFoundException();
 *
 * @example
 * // Throw with specific reservation ID
 * throw new SessionSeatReservationNotFoundException('reservation-123');
 */
export class SessionSeatReservationNotFoundException extends CustomException {
  /**
   * Logger instance for this exception class.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(
    SessionSeatReservationNotFoundException.name,
  );

  /**
   * Creates a new SessionSeatReservationNotFoundException instance.
   *
   * @param {string} [id] - Optional reservation ID that was not found.
   *                        If provided, the error message will include the ID.
   *
   * @throws {SessionSeatReservationNotFoundException} Always throws with HTTP status 404.
   */
  constructor(id?: string) {
    const message = id
      ? 'sessions.SESSION_SEAT_RESERVATION_NOT_FOUND_WITH_ID'
      : 'sessions.SESSION_SEAT_RESERVATION_NOT_FOUND';

    super(message, 404, { id });

    this.logger.warn(
      id
        ? 'Session seat reservation not found with id: ' + id
        : 'Session seat reservation not found',
    );
  }
}
