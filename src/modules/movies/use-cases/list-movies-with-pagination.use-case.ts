/**
 * @fileoverview Use case for listing movies with pagination support.
 *
 * @description
 * This file contains the use case implementation for retrieving a paginated list of movies
 * from the data store. It handles the business logic for fetching movies with pagination
 * parameters and returns the resulting paginated movie collection.
 *
 * @module list-movies-with-pagination.use-case
 */

import { ListMoviesWithPaginationDto } from '../dtos';
import { MovieSchema } from '../schemas';
import { MoviesRepository } from '../repositories';
import { Injectable } from '@nestjs/common';
import { IListMoviesWithPaginationUseCase } from '../interfaces/list-movies-with-pagination.use-case.interface';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';

/**
 * Use case class responsible for listing movies with pagination support.
 * Implements the IListMoviesWithPaginationUseCase interface to follow the use case pattern.
 *
 * @class ListMoviesWithPaginationUseCase
 * @implements {IListMoviesWithPaginationUseCase}
 *
 * @example
 * // Inject and use in a controller or service
 * const listMoviesUseCase = new ListMoviesWithPaginationUseCase(moviesRepository);
 * const paginatedMovies = await listMoviesUseCase.execute({
 *   page: 1,
 *   limit: 10
 * });
 */
@Injectable()
export class ListMoviesWithPaginationUseCase implements IListMoviesWithPaginationUseCase {
  /**
   * Creates an instance of ListMoviesWithPaginationUseCase.
   *
   * @param {MoviesRepository} moviesRepository - The repository for movie data persistence operations.
   */
  constructor(private readonly moviesRepository: MoviesRepository) {}

  /**
   * Executes the list movies with pagination use case.
   * Retrieves a paginated list of movie entities from the database.
   *
   * @async
   * @param {ListMoviesWithPaginationDto} dto - The data transfer object containing pagination parameters.
   * @returns {Promise<PaginationResultDto<MovieSchema>>} A promise that resolves to a paginated result containing movies and metadata.
   *
   * @example
   * const result = await listMoviesUseCase.execute({ page: 1, limit: 10 });
   * console.log(result.data); // Array of MovieSchema objects
   * console.log(result.metadata); // { currentPage: 1, totalPages: 5, limit: 10 }
   */
  async execute(
    dto: ListMoviesWithPaginationDto,
  ): Promise<PaginationResultDto<MovieSchema>> {
    const result = await this.moviesRepository.listWithPagination(dto);

    return result;
  }
}
