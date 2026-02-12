/**
 * @fileoverview Exception thrown when bulk session seats cannot be created.
 *
 * @description
 * This file contains a custom exception class that extends NestJS's
 * BadRequestException. It is thrown when the system fails to create
 * bulk session seats records in the database.
 *
 * @module unable-to-create-bulk-session-seats.exception
 */

import { Logger } from '@nestjs/common';
import { CustomException } from 'src/shared/exceptions/custom.exception';

/**
 * Exception thrown when bulk session seats creation fails.
 *
 * @description
 * This exception is used in the SessionSeatsRepository when an insert
 * operation fails to return a valid bulk session seats record. It logs a
 * warning message and returns a 400 Bad Request response to the client.
 *
 * @extends {CustomException}
 */
export class UnableToCreateBulkSessionSeatsException extends CustomException {
  /**
   * Logger instance for this exception class.
   *
   * @private
   * @readonly
   */
  private readonly logger = new Logger(
    UnableToCreateBulkSessionSeatsException.name,
  );

  /**
   * Creates an instance of UnableToCreateBulkSessionSeatsException.
   *
   * @description
   * Initializes the exception with a predefined error message,
   * calls the parent BadRequestException constructor, and logs
   * a warning message for debugging purposes.
   */
  constructor() {
    const message = 'sessions.UNABLE_TO_CREATE_BULK_SESSION_SEATS';

    super(message, 400);

    this.logger.warn('Unable to create bulk session seats');
  }
}
