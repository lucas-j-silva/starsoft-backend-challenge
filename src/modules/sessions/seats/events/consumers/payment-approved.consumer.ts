import { Controller, Logger, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentsMessagesTopics } from '../../../../payments/events/enums/payments-messages-topics.enum';
import { PaymentApprovedMessage } from '../../../../payments/events/messages';
import { SessionSeatsService } from '../../services';
import { SessionSeatNotFoundException } from '../../exceptions';
import { SessionSeatReservationNotFoundException } from '../../exceptions/session-seat-reservation-not-found.exception';

@Controller()
export class SessionSeatPaymentApprovedConsumer {
  private readonly logger = new Logger(SessionSeatPaymentApprovedConsumer.name);

  constructor(private readonly sessionSeatsService: SessionSeatsService) {}

  @EventPattern(PaymentsMessagesTopics.PAYMENT_APPROVED)
  async handlePaymentApproved(
    @Payload(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    )
    payload: PaymentApprovedMessage,
  ) {
    this.logger.debug(
      `Received payment approved event with payload: ${JSON.stringify(payload)}`,
    );

    try {
      await this.sessionSeatsService.handlePaymentApproved(payload);
    } catch (error) {
      if (error instanceof SessionSeatReservationNotFoundException) {
        return;
      } else if (error instanceof SessionSeatNotFoundException) {
        return;
      }

      throw error;
    }
  }
}
