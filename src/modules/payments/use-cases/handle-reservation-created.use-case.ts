import { ReservationCreatedMessage } from '../../sessions/seats/events/messages';
import { IHandleReservationCreatedUseCase } from '../interfaces/handle-reservation-created.use-case-interface';
import { PaymentsRepository } from '../repositories/payments.repository';
import { SessionsService } from '../../sessions/core/services';
import { PaymentsProducer } from '../events/producers';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HandleReservationCreatedUseCase implements IHandleReservationCreatedUseCase {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly sessionsService: SessionsService,
    private readonly paymentsProducer: PaymentsProducer,
  ) {}

  async execute(payload: ReservationCreatedMessage): Promise<void> {
    const sessionPrice = await this.sessionsService.getSessionValuePerSeat(
      payload.sessionId,
    );

    const payment = await this.paymentsRepository.insert({
      userId: payload.userId,
      amountInCents: sessionPrice,
      expiresAt: payload.expiresAt,
      externalId: payload.id,
    });

    await this.paymentsProducer.sendPaymentCreatedEvent({
      id: payment.id,
      userId: payment.userId,
      amountInCents: payment.amountInCents,
      expiresAt: payment.expiresAt,
      externalId: payment.externalId,
    });

    return;
  }
}
