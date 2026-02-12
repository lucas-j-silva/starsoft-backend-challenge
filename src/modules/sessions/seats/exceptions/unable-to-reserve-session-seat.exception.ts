import { Logger, ServiceUnavailableException } from '@nestjs/common';

export class UnableToReserveSessionSeatException extends ServiceUnavailableException {
  private readonly logger = new Logger(
    UnableToReserveSessionSeatException.name,
  );

  constructor(customMessage?: string) {
    const message = customMessage ?? 'sessions.UNABLE_TO_RESERVE_SESSION_SEAT';

    super(message);

    this.logger.warn(message);
  }
}
