/**
 * @fileoverview Custom exception for seat not found scenarios.
 *
 * @description
 * This file contains the SeatNotFoundException class which extends NestJS's
 * NotFoundException to provide specific error handling for seat lookup failures.
 *
 * @module seat-not-found.exception
 */

import { Logger, NotFoundException } from '@nestjs/common';

/**
 * Exception thrown when a seat cannot be found in the database.
 * Extends NestJS NotFoundException to provide HTTP 404 responses.
 *
 * @class SeatNotFoundException
 * @extends {NotFoundException}
 *
 * @example
 * // Throw with a specific seat ID
 * throw new SeatNotFoundException('room-uuid', 'A', 1);
 * // Logs: "Seat with roomId room-uuid, row A, and column 1 not found"
 *
 * @example
 * // Throw without a room ID
 * throw new SeatNotFoundException('room-uuid', 'A', 1);
 * // Logs: "Seat not found"
 */
export class SeatNotFoundException extends NotFoundException {
  private readonly logger = new Logger(SeatNotFoundException.name);

  /**
   * Creates an instance of SeatNotFoundException.
   */
  constructor() {
    const message = `Seat not found`;
    super(message);
    this.logger.warn(message);
  }
}
