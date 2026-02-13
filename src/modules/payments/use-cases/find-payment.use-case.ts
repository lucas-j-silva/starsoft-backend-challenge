import { Injectable } from '@nestjs/common';
import { FindPaymentDto } from '../dtos';
import { IFindPaymentUseCase } from '../interfaces';
import { PaymentsRepository } from '../repositories/payments.repository';
import { PaymentSchema } from '../schemas';

@Injectable()
export class FindPaymentUseCase implements IFindPaymentUseCase {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async execute(dto: FindPaymentDto): Promise<PaymentSchema> {
    const payment = dto.userId
      ? this.paymentsRepository.findByIdAndUserId(dto.id, dto.userId)
      : this.paymentsRepository.findById(dto.id);

    return payment;
  }
}
