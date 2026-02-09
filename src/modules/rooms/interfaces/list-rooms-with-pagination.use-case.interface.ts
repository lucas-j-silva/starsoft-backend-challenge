/**
 * @fileoverview Interfaces for the List Rooms With Pagination use case.
 *
 * @description
 * This file contains the interfaces for the List Rooms With Pagination use case.
 *
 * @module list-rooms-with-pagination.use-case.interface
 */

import { ListRoomsWithPaginationDto } from '../dtos';
import { PaginationResultDto } from 'src/shared/dtos/pagination-result.dto';
import { RoomSchema } from '../schemas';

/**
 * Interface defining the contract for the List Rooms With Pagination use case.
 * Implements the use case pattern for listing rooms with pagination.
 *
 * @interface IListRoomsWithPaginationUseCase
 *
 * @example
 * class ListRoomsWithPaginationUseCase implements IListRoomsWithPaginationUseCase {
 *   async execute(pagination: ListRoomsWithPaginationDto): Promise<PaginationResultDto<RoomSchema>> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IListRoomsWithPaginationUseCase {
  /**
   * Executes the list rooms with pagination use case.
   *
   * @param {ListRoomsWithPaginationDto} pagination - The data transfer object containing the pagination parameters.
   * @returns {Promise<PaginationResultDto<RoomSchema>>} A promise that resolves to a paginated result containing rooms and metadata.
   *
   * @example
   * const result = await listRoomsWithPaginationUseCase.execute({ page: 1, limit: 10 });
   * console.log(result.data); // Array of RoomSchema
   * console.log(result.metadata.totalPages); // Total number of pages
   */
  execute(
    pagination: ListRoomsWithPaginationDto,
  ): Promise<PaginationResultDto<RoomSchema>>;
}
