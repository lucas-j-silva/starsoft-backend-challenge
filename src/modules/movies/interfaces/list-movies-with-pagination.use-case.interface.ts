/**
 * @fileoverview Interface for the List Movies with Pagination use case.
 *
 * @description
 * This file contains the interface for the List Movies with Pagination use case.
 *
 * @module list-movies-with-pagination.use-case.interface
 */

import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { ListMoviesWithPaginationDto } from '../dtos';
import { MovieSchema } from '../schemas';

/**
 * Interface for the List Movies with Pagination use case.
 *
 * Defines the contract for retrieving a paginated list of movies
 * from the data source.
 *
 * @interface IListMoviesWithPaginationUseCase
 *
 * @example
 * ```typescript
 * class ListMoviesWithPaginationUseCase implements IListMoviesWithPaginationUseCase {
 *   async execute(dto: ListMoviesWithPaginationDto): Promise<PaginationResultDto<MovieSchema>> {
 *     // Implementation
 *   }
 * }
 * ```
 */
export interface IListMoviesWithPaginationUseCase {
  /**
   * Executes the use case to retrieve a paginated list of movies.
   *
   * @param {ListMoviesWithPaginationDto} dto - The data transfer object containing pagination parameters
   *                                            such as page number, page size, and optional filters.
   * @returns {Promise<PaginationResultDto<MovieSchema>>} A promise that resolves to a paginated result
   *                                                       containing an array of movie schemas and
   *                                                       pagination metadata.
   *
   * @example
   * ```typescript
   * const result = await listMoviesUseCase.execute({
   *   page: 1,
   *   limit: 10,
   * });
   * // Returns: { data: MovieSchema[], total: number, page: number, limit: number, ... }
   * ```
   */
  execute(
    dto: ListMoviesWithPaginationDto,
  ): Promise<PaginationResultDto<MovieSchema>>;
}
