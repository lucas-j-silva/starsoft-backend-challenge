import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dtos';
import { ICreatePaymentUseCase } from '../interfaces';
import { PaymentsRepository } from '../repositories/payments.repository';
import { PaymentSchema } from '../schemas';

@Injectable()
export class CreatePaymentUseCase implements ICreatePaymentUseCase {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async execute(dto: CreatePaymentDto): Promise<PaymentSchema> {
    const payment = await this.paymentsRepository.insert({
      userId: dto.userId,
      amountInCents: dto.amountInCents,
      expiresAt: dto.expiresAt,
      externalId: dto.externalId,
    });

    return payment;
  }
}
