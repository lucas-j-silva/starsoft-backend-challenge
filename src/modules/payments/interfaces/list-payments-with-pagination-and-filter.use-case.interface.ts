import { ListPaymentsWithPaginationAndFilterDto } from '../dtos';
import { PaginationResultDto } from 'src/shared/dtos/pagination-result.dto';
import { PaymentSchema } from '../schemas';

export interface IListPaymentsWithPaginationAndFilterUseCase {
  execute(
    data: ListPaymentsWithPaginationAndFilterDto,
  ): Promise<PaginationResultDto<PaymentSchema>>;
}
