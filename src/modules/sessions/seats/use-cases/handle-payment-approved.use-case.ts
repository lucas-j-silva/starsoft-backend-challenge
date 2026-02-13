import { Injectable, Logger } from '@nestjs/common';
import { IHandlePaymentApprovedUseCase } from '../interfaces/handle-payment-approved.use-case';
import {
  SessionSeatReservationsRepository,
  SessionSeatsRepository,
} from '../repositories';
import { PaymentApprovedMessage } from '../../../payments/events/messages';
import { SessionSeatsCacheService } from '../cache/services';
import { Transactional } from '@nestjs-cls/transactional';

@Injectable()
export class HandlePaymentApprovedUseCase implements IHandlePaymentApprovedUseCase {
  private readonly logger = new Logger(HandlePaymentApprovedUseCase.name);

  constructor(
    private readonly sessionsSeatsReservationsRepository: SessionSeatReservationsRepository,
    private readonly sessionSeatsRepository: SessionSeatsRepository,
    private readonly sessionSeatsCacheService: SessionSeatsCacheService,
  ) {}

  @Transactional()
  async execute(payload: PaymentApprovedMessage): Promise<void> {
    const startTime = performance.now();

    if (!payload.externalId) return;

    const reservation = await this.sessionsSeatsReservationsRepository.findById(
      payload.externalId,
    );

    const sessionSeat = await this.sessionSeatsRepository.findByIdWithRelations(
      reservation.sessionSeatId,
    );

    await this.sessionSeatsRepository.update(sessionSeat.id, {
      isAvailable: false,
      soldAt: new Date(),
      userId: reservation.userId,
    });

    await this.sessionSeatsCacheService.setSessionSeatAvailability(
      sessionSeat.id,
      false,
      sessionSeat.relations?.session?.startTime,
    );

    this.logger.debug(
      `Handle payment approved use case execution time: ${performance.now() - startTime}ms`,
    );

    return;
  }
}
