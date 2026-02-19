/**
 * @fileoverview Use case for listing payments with pagination and filtering.
 *
 * @description
 * This file contains the use case responsible for retrieving a paginated and
 * filtered list of payment records. It delegates entirely to the payments
 * repository and returns the structured pagination result.
 *
 * @module list-payments-with-pagination-and-filter.use-case
 */

import { Injectable } from '@nestjs/common';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { PaymentsRepository } from '../repositories/payments.repository';
import { IListPaymentsWithPaginationAndFilterUseCase } from '../interfaces';
import { PaymentSchema } from '../schemas';
import { ListPaymentsWithPaginationAndFilterDto } from '../dtos';

/**
 * Use case for listing payments with pagination and optional filters.
 *
 * @description
 * Handles the business logic for retrieving a paginated list of payment
 * records, optionally filtered by criteria specified in the DTO. The use
 * case delegates the query to the payments repository and returns the
 * result wrapped in a pagination envelope.
 *
 * @class ListPaymentsWithPaginationAndFilterUseCase
 * @implements {IListPaymentsWithPaginationAndFilterUseCase}
 */
@Injectable()
export class ListPaymentsWithPaginationAndFilterUseCase implements IListPaymentsWithPaginationAndFilterUseCase {
  /**
   * Creates an instance of ListPaymentsWithPaginationAndFilterUseCase.
   *
   * @param {PaymentsRepository} paymentsRepository - Repository for paginated payment retrieval operations.
   */
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  /**
   * Executes the paginated and filtered payment listing process.
   *
   * @description
   * Delegates the query to `paymentsRepository.listWithPaginationAndFilter`
   * using the supplied DTO and returns the resulting paginated payment list.
   *
   * @async
   * @param {ListPaymentsWithPaginationAndFilterDto} data - The DTO containing pagination parameters and optional filter criteria.
   * @returns {Promise<PaginationResultDto<PaymentSchema>>} A promise that resolves to a paginated list of payment entities.
   *
   * @example
   * const result = await useCase.execute({
   *   page: 1,
   *   limit: 10,
   *   userId: 'user-uuid',
   * });
   * // Returns: { data: [{ id: '...', ... }], total: 42, page: 1, limit: 10 }
   */
  async execute(
    data: ListPaymentsWithPaginationAndFilterDto,
  ): Promise<PaginationResultDto<PaymentSchema>> {
    const result =
      await this.paymentsRepository.listWithPaginationAndFilter(data);

    return result;
  }
}
