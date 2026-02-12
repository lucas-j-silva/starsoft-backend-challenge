import { BadRequestException, Logger } from '@nestjs/common';

export class UnableToUpdateSessionSeatException extends BadRequestException {
  private readonly logger = new Logger(UnableToUpdateSessionSeatException.name);

  constructor(customMessage?: string) {
    const message = customMessage ?? 'Unable to update session seat';

    super(message);

    this.logger.warn(message);
  }
}
