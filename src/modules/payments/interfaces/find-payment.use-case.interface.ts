import { FindPaymentDto } from '../dtos';
import { PaymentSchema } from '../schemas';

export interface IFindPaymentUseCase {
  execute(dto: FindPaymentDto): Promise<PaymentSchema>;
}
