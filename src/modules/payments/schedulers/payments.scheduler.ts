import { Cron } from '@nestjs/schedule';
import { CronExpression } from '@nestjs/schedule';
import { PaymentsRepository } from '../repositories/payments.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentsProducer } from '../events/producers';

@Injectable()
export class PaymentsScheduler {
  private readonly logger = new Logger(PaymentsScheduler.name);

  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly paymentsProducer: PaymentsProducer,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  @Transactional()
  async handleExpiredPayments() {
    const startTime = performance.now();

    const expiredPayments = await this.paymentsRepository.listExpiredPayments();

    for (const payment of expiredPayments) {
      await Promise.all([
        this.paymentsRepository.update(payment.id, {
          status: PaymentStatus.EXPIRED,
        }),
        this.paymentsProducer.sendPaymentExpiredEvent({
          id: payment.id,
          userId: payment.userId,
          amountInCents: payment.amountInCents,
          expiresAt: payment.expiresAt,
          externalId: payment.externalId,
          expiredAt: new Date(),
        }),
      ]);
    }

    if (expiredPayments.length > 0) {
      this.logger.debug(
        `Found ${expiredPayments.length} expired payments, processed in: ${performance.now() - startTime}ms`,
      );
    }
  }
}
