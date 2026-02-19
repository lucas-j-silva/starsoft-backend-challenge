/**
 * @fileoverview Interface defining the contract for the List Payments with Pagination and Filter use case.
 *
 * @description
 * This file declares the interface that any List Payments use case implementation
 * must satisfy, ensuring a consistent API for paginated and filtered payment
 * retrieval across the module.
 *
 * @module list-payments-with-pagination-and-filter.use-case.interface
 */

import { ListPaymentsWithPaginationAndFilterDto } from '../dtos';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { PaymentSchema } from '../schemas';

/**
 * Interface defining the contract for the List Payments with Pagination and Filter use case.
 * Implements the use case pattern for retrieving a paginated and filtered collection of payments.
 *
 * @interface IListPaymentsWithPaginationAndFilterUseCase
 *
 * @example
 * class ListPaymentsWithPaginationAndFilterUseCase implements IListPaymentsWithPaginationAndFilterUseCase {
 *   async execute(data: ListPaymentsWithPaginationAndFilterDto): Promise<PaginationResultDto<PaymentSchema>> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IListPaymentsWithPaginationAndFilterUseCase {
  /**
   * Executes the list payments with pagination and filter use case.
   *
   * @param {ListPaymentsWithPaginationAndFilterDto} data - The DTO containing pagination parameters and optional filter criteria.
   * @returns {Promise<PaginationResultDto<PaymentSchema>>} A promise that resolves to a paginated list of payment entities.
   *
   * @example
   * const result = await listPaymentsUseCase.execute({
   *   page: 1,
   *   limit: 10,
   *   userId: 'user-uuid',
   * });
   * // Returns: { data: [...], total: 42, page: 1, limit: 10 }
   */
  execute(
    data: ListPaymentsWithPaginationAndFilterDto,
  ): Promise<PaginationResultDto<PaymentSchema>>;
}
