import { Controller, Logger, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReservationCreatedMessage } from '../../../sessions/seats/events/messages';
import { SessionSeatsMessagesTopics } from '../../../sessions/seats/events/enums';
import { PaymentsService } from '../../services/payments.service';

@Controller()
export class PaymentsReservationCreatedConsumer {
  private readonly logger = new Logger(PaymentsReservationCreatedConsumer.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @EventPattern(SessionSeatsMessagesTopics.RESERVATIONS_CREATED)
  async handleReservationCreated(
    @Payload(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    payload: ReservationCreatedMessage,
  ) {
    this.logger.debug(
      `Received reservation created event with payload: ${JSON.stringify(payload)}`,
    );

    await this.paymentsService.handleReservationCreated(payload);
  }
}
