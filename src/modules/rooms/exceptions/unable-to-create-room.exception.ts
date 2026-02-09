/**
 * @fileoverview Exceptions for the Rooms module.
 *
 * @description
 * This file contains the exceptions for the Rooms module.
 *
 * @module unable-to-create-room.exception
 */

import { BadRequestException, Logger } from '@nestjs/common';

/**
 * Custom exception thrown when a room cannot be created in the database.
 * Extends NestJS's BadRequestException to provide HTTP 400 responses.
 *
 * @extends {BadRequestException}
 *
 * @example
 * // Throw when unable to create room
 * throw new UnableToCreateRoomException();
 */
export class UnableToCreateRoomException extends BadRequestException {
  /**
   * Logger instance for recording warning messages when the exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(UnableToCreateRoomException.name);

  constructor() {
    const message = 'Unable to create room';

    super(message);

    this.logger.warn(message);
  }
}
