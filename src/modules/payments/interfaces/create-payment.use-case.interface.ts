import { CreatePaymentDto } from '../dtos';
import { PaymentSchema } from '../schemas';

export interface ICreatePaymentUseCase {
  execute(dto: CreatePaymentDto): Promise<PaymentSchema>;
}
