/**
 * @fileoverview Interface for the List Seats with Pagination use case.
 *
 * @description
 * This file defines the contract for listing seats with pagination support.
 * It provides a standardized interface for retrieving paginated lists of
 * seats within a specific room.
 *
 * @module list-seats-with-pagination.use-case.interface
 */

import { ListSeatsWithPaginationDto } from '../dtos';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { SeatSchema } from '../schemas';

/**
 * Interface for the List Seats with Pagination use case.
 *
 * @description
 * Defines the contract for implementations that handle listing seats
 * with pagination. This interface ensures consistent behavior across
 * different implementations of the seat listing functionality.
 *
 * @interface IListSeatsWithPaginationUseCase
 *
 * @example
 * // Implementing the interface
 * class ListSeatsWithPaginationUseCase implements IListSeatsWithPaginationUseCase {
 *   async execute(data: ListSeatsWithPaginationDto): Promise<PaginationResultDto<SeatSchema>> {
 *     // Implementation logic here
 *   }
 * }
 */
export interface IListSeatsWithPaginationUseCase {
  /**
   * Executes the list seats with pagination use case.
   *
   * @description
   * Retrieves a paginated list of seats based on the provided criteria,
   * including room filtering and pagination parameters.
   *
   * @param {ListSeatsWithPaginationDto} data - The DTO containing pagination parameters and room filter.
   * @returns {Promise<PaginationResultDto<SeatSchema>>} A promise that resolves to a paginated result containing seat data.
   *
   * @example
   * const result = await useCase.execute({
   *   roomId: '123e4567-e89b-12d3-a456-426614174000',
   *   page: 1,
   *   limit: 10
   * });
   */
  execute(
    data: ListSeatsWithPaginationDto,
  ): Promise<PaginationResultDto<SeatSchema>>;
}
