import { Logger } from '@nestjs/common';
import { CustomException } from 'src/shared/exceptions/custom.exception';

export class SessionSeatReservationNotFoundException extends CustomException {
  private readonly logger = new Logger(
    SessionSeatReservationNotFoundException.name,
  );

  constructor(id?: string) {
    const message = id
      ? 'sessions.SESSION_SEAT_RESERVATION_NOT_FOUND_WITH_ID'
      : 'sessions.SESSION_SEAT_RESERVATION_NOT_FOUND';

    super(message, 404, { id });

    this.logger.warn(
      id
        ? 'Session seat reservation not found with id: ' + id
        : 'Session seat reservation not found',
    );
  }
}
