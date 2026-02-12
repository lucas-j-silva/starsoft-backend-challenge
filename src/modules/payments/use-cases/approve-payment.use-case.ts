import { IApprovePaymentUseCase } from '../interfaces/approve-payment.use-case.interface';
import { PaymentsRepository } from '../repositories/payments.repository';
import { ApprovePaymentDto } from '../dtos';
import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '../enums/payment-status.enum';
import { UnableToApprovePaymentException } from '../exceptions/unable-to-approve-payment.exception';
import { PaymentsProducer } from '../events/producers';

@Injectable()
export class ApprovePaymentUseCase implements IApprovePaymentUseCase {
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly paymentsProducer: PaymentsProducer,
  ) {}

  async execute(data: ApprovePaymentDto): Promise<void> {
    const payment = await this.paymentsRepository.findByIdOrExternalId(
      data.idOrExternalId,
    );

    if (payment.status !== PaymentStatus.PENDING) {
      throw new UnableToApprovePaymentException('Payment is not pending');
    }

    if (payment.expiresAt && payment.expiresAt < new Date()) {
      throw new UnableToApprovePaymentException('Payment has expired');
    }

    const updatedPayment = await this.paymentsRepository.update(payment.id, {
      status: PaymentStatus.APPROVED,
      approvedAt: new Date(),
    });

    await this.paymentsProducer.sendPaymentApprovedEvent({
      id: updatedPayment.id,
      userId: updatedPayment.userId,
      amountInCents: updatedPayment.amountInCents,
      expiresAt: updatedPayment.expiresAt,
      approvedAt: updatedPayment.approvedAt as Date,
      externalId: updatedPayment.externalId,
    });

    return;
  }
}
