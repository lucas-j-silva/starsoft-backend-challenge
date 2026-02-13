import { Injectable } from '@nestjs/common';
import {
  ApprovePaymentDto,
  CreatePaymentDto,
  FindPaymentDto,
  ListPaymentsWithPaginationAndFilterDto,
} from '../dtos';
import { CreatePaymentUseCase } from '../use-cases/create-payment.use-case';
import { PaymentSchema } from '../schemas';
import { HandleReservationCreatedUseCase } from '../use-cases/handle-reservation-created.use-case';
import { ListPaymentsWithPaginationAndFilterUseCase } from '../use-cases/list-payments-with-pagination-and-filter.use-case';
import { ReservationCreatedMessage } from '../../sessions/seats/events/messages';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { ApprovePaymentUseCase } from '../use-cases/approve-payment.use-case';
import { FindPaymentUseCase } from '../use-cases/find-payment.use-case';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly handleReservationCreatedUseCase: HandleReservationCreatedUseCase,
    private readonly listPaymentsWithPaginationAndFilterUseCase: ListPaymentsWithPaginationAndFilterUseCase,
    private readonly approvePaymentUseCase: ApprovePaymentUseCase,
    private readonly findPaymentUseCase: FindPaymentUseCase,
  ) {}

  async create(data: CreatePaymentDto): Promise<PaymentSchema> {
    return this.createPaymentUseCase.execute(data);
  }

  async handleReservationCreated(
    payload: ReservationCreatedMessage,
  ): Promise<void> {
    return this.handleReservationCreatedUseCase.execute(payload);
  }

  async listWithPaginationAndFilter(
    data: ListPaymentsWithPaginationAndFilterDto,
  ): Promise<PaginationResultDto<PaymentSchema>> {
    return this.listPaymentsWithPaginationAndFilterUseCase.execute(data);
  }

  async approvePayment(data: ApprovePaymentDto): Promise<void> {
    return this.approvePaymentUseCase.execute(data);
  }

  async findPayment(data: FindPaymentDto): Promise<PaymentSchema> {
    return this.findPaymentUseCase.execute(data);
  }
}
