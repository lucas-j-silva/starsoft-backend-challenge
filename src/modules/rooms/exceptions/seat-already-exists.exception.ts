import { ConflictException, Logger } from '@nestjs/common';

/**
 * Exception thrown when a seat already exists in the database.
 * Extends NestJS ConflictException to provide HTTP 409 responses.
 *
 * @class SeatAlreadyExistsException
 * @extends {ConflictException}
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
export class SeatAlreadyExistsException extends ConflictException {
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

    super(message);

    this.logger.warn(message);
  }
}
