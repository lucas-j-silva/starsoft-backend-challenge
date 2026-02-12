import { NotFoundException, Logger } from '@nestjs/common';

export class SessionSeatReservationNotFoundException extends NotFoundException {
  private readonly logger = new Logger(
    SessionSeatReservationNotFoundException.name,
  );

  constructor(customMessage?: string) {
    const message = customMessage ?? 'Session seat reservation not found';

    super(message);

    this.logger.warn(message);
  }
}
