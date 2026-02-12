import { CreatePaymentUseCase } from './create-payment.use-case';
import { HandleReservationCreatedUseCase } from './handle-reservation-created.use-case';
import { ListPaymentsWithPaginationAndFilterUseCase } from './list-payments-with-pagination-and-filter.use-case';
import { ApprovePaymentUseCase } from './approve-payment.use-case';

export const PaymentsUseCases = [
  CreatePaymentUseCase,
  HandleReservationCreatedUseCase,
  ListPaymentsWithPaginationAndFilterUseCase,
  ApprovePaymentUseCase,
];
