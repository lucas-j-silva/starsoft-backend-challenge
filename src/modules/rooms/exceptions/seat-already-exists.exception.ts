/**
 * @fileoverview Exception thrown when a seat already exists in the database.
 *
 * @description
 * This file contains the SeatAlreadyExistsException class which extends NestJS's
 * BadRequestException to provide specific error handling for seat creation conflicts.
 *
 * @module seat-already-exists.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from '../../../shared/exceptions/custom.exception';

/**
 * Exception thrown when a seat already exists in the database.
 * Extends CustomException to provide HTTP 409 responses.
 *
 * @class SeatAlreadyExistsException
 * @extends {CustomException}
 *
 * @example
 * // Throw when seat already exists
 * throw new SeatAlreadyExistsException('room-uuid', 'A', 1);
 * // Logs: "Seat with roomId room-uuid, row A, and column 1 already exists"
 *
 * @example
 * // Throw without a room ID
 * throw new SeatAlreadyExistsException();
 * // Logs: "Seat already exists"
 */
export class SeatAlreadyExistsException extends CustomException {
  /**
   * Logger instance for logging warning messages when exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(SeatAlreadyExistsException.name);

  /**
   * Creates an instance of SeatAlreadyExistsException.
   */
  constructor() {
    const message = 'rooms.SEAT_ALREADY_EXISTS';

    super(message, 409);

    this.logger.warn(message);
  }
}
