/**
 * @fileoverview Interface for the List Sessions With Pagination use case.
 *
 * @description
 * This file contains the interface for the List Sessions With Pagination use case.
 *
 * @module list-sessions-with-pagination.use-case.interface
 */

import { ListSessionsWithPaginationDto } from '../dtos';
import { PaginationResultDto } from 'src/shared/dtos/pagination-result.dto';
import { SessionSchema } from '../schemas';

/**
 * Interface for the List Sessions With Pagination use case.
 *
 * @description
 * Defines the contract for use cases that list sessions with pagination.
 * Implementations of this interface should retrieve paginated lists of
 * sessions based on the provided criteria.
 *
 * @interface IListSessionsWithPaginationUseCase
 *
 * @example
 * class ListSessionsWithPaginationUseCase implements IListSessionsWithPaginationUseCase {
 *   async execute(pagination: ListSessionsWithPaginationDto): Promise<PaginationResultDto<SessionSchema>> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IListSessionsWithPaginationUseCase {
  /**
   * Executes the list sessions with pagination use case.
   *
   * @param {ListSessionsWithPaginationDto} pagination - The data transfer object containing the pagination parameters.
   * @returns {Promise<PaginationResultDto<SessionSchema>>} A promise that resolves to a paginated result containing session data.
   *
   * @example
   * const result = await listSessionsWithPaginationUseCase.execute({ page: 1, limit: 10 });
   * console.log(result.data); // Array of SessionSchema
   * console.log(result.metadata.totalPages); // Total number of pages
   */
  execute(
    pagination: ListSessionsWithPaginationDto,
  ): Promise<PaginationResultDto<SessionSchema>>;
}
