import { ApprovePaymentDto } from '../dtos';

export interface IApprovePaymentUseCase {
  execute(dto: ApprovePaymentDto): Promise<void>;
}
