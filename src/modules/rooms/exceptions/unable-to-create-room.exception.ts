/**
 * @fileoverview Exceptions for the Rooms module.
 *
 * @description
 * This file contains the exceptions for the Rooms module.
 *
 * @module unable-to-create-room.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from 'src/shared/exceptions/custom.exception';

/**
 * Custom exception thrown when a room cannot be created in the database.
 * Extends CustomException to provide HTTP 400 responses.
 *
 * @extends {CustomException}
 *
 * @example
 * // Throw when unable to create room
 * throw new UnableToCreateRoomException();
 */
export class UnableToCreateRoomException extends CustomException {
  /**
   * Logger instance for recording warning messages when the exception is thrown.
   * @private
   * @readonly
   */
  private readonly logger = new Logger(UnableToCreateRoomException.name);

  constructor() {
    const message = 'rooms.UNABLE_TO_CREATE_ROOM';

    super(message, 400);

    this.logger.warn(message);
  }
}
