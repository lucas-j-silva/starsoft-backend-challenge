import { Logger, ServiceUnavailableException } from '@nestjs/common';

export class UnableToReserveSessionSeatException extends ServiceUnavailableException {
  private readonly logger = new Logger(
    UnableToReserveSessionSeatException.name,
  );

  constructor(customMessage?: string) {
    const message = customMessage ?? 'Unable to reserve session seat';

    super(message);

    this.logger.warn(message);
  }
}
