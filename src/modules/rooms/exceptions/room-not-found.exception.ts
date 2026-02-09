/**
 * @fileoverview Custom exception for room not found scenarios.
 *
 * @description
 * This file contains the RoomNotFoundException class which extends NestJS's
 * NotFoundException to provide specific error handling for room lookup failures.
 *
 * @module room-not-found.exception
 */

import { Logger, NotFoundException } from '@nestjs/common';

/**
 * Exception thrown when a room cannot be found in the database.
 * Extends NestJS NotFoundException to provide HTTP 404 responses.
 *
 * @class RoomNotFoundException
 * @extends {NotFoundException}
 *
 * @example
 * // With room ID
 * throw new RoomNotFoundException('550e8400-e29b-41d4-a716-446655440000');
 * // Logs: "Room with id 550e8400-e29b-41d4-a716-446655440000 not found"
 *
 * @example
 * // Without room ID
 * throw new RoomNotFoundException();
 * // Logs: "Room not found"
 */
export class RoomNotFoundException extends NotFoundException {
  /**
   * Logger instance for logging warning messages when exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(RoomNotFoundException.name);

  /**
   * Creates an instance of RoomNotFoundException.
   *
   * @param {string} [id] - Optional room ID that was not found.
   */
  constructor(id?: string) {
    const message = id ? `Room with id ${id} not found` : 'Room not found';

    super(message);

    this.logger.warn(message);
  }
}
