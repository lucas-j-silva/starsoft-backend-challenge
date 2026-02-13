/**
 * @fileoverview Exception thrown when attempting to reserve a session seat that has already been reserved.
 *
 * @description
 * This file contains the SessionSeatAlreadyReservedException class which extends NestJS's
 * BadRequestException to provide specific error handling for session seat reservation conflicts.
 *
 * @module session-seat-already-reserved.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from '../../../../shared/exceptions/custom.exception';

/**
 * Exception thrown when attempting to reserve a session seat that has already been reserved.
 *
 * This exception extends CustomException and is used to indicate
 * that a seat reservation request cannot be fulfilled because the seat is already
 * held by another user in the reservation cache.
 *
 * @extends {CustomException}
 *
 * @example
 * // Throwing the exception when a seat is already reserved
 * const isReserved = await sessionSeatsReservationCacheService.getReservation(sessionSeat.id);
 * if (isReserved) {
 *   throw new SessionSeatAlreadyReservedException();
 * }
 */
export class SessionSeatAlreadyReservedException extends CustomException {
  /**
   * Logger instance for logging warning messages when this exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(
    SessionSeatAlreadyReservedException.name,
  );

  /**
   * Creates a new instance of SessionSeatAlreadyReservedException.
   * Logs a warning message upon instantiation to track reservation conflicts.
   */
  constructor(expiresAt?: Date) {
    const message = expiresAt
      ? 'sessions.SESSION_SEAT_ALREADY_RESERVED_WITH_EXPIRES_AT'
      : 'sessions.SESSION_SEAT_ALREADY_RESERVED';

    super(message, 409, { expiresAt: expiresAt?.toISOString() });

    this.logger.warn(
      expiresAt
        ? `Session seat already reserved until ${expiresAt.toISOString()}`
        : 'Session seat already reserved',
    );
  }
}
