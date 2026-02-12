import { Injectable } from '@nestjs/common';
import { PaginationResultDto } from 'src/shared/dtos/pagination-result.dto';
import { PaymentsRepository } from '../repositories/payments.repository';
import { IListPaymentsWithPaginationAndFilterUseCase } from '../interfaces';
import { PaymentSchema } from '../schemas';
import { ListPaymentsWithPaginationAndFilterDto } from '../dtos';

@Injectable()
export class ListPaymentsWithPaginationAndFilterUseCase implements IListPaymentsWithPaginationAndFilterUseCase {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async execute(
    data: ListPaymentsWithPaginationAndFilterDto,
  ): Promise<PaginationResultDto<PaymentSchema>> {
    const result =
      await this.paymentsRepository.listWithPaginationAndFilter(data);

    return result;
  }
}
