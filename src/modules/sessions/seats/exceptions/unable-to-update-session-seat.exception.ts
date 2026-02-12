import { Logger } from '@nestjs/common';
import { CustomException } from 'src/shared/exceptions/custom.exception';

export class UnableToUpdateSessionSeatException extends CustomException {
  private readonly logger = new Logger(UnableToUpdateSessionSeatException.name);

  constructor(customMessage?: string) {
    const message = customMessage ?? 'sessions.UNABLE_TO_UPDATE_SESSION_SEAT';

    super(message, 400);

    this.logger.warn('Unable to update session seat');
  }
}
