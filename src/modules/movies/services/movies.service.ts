/**
 * @fileoverview Service class for managing movie-related operations.
 *
 * @description
 * This file contains the MoviesService class which acts as a facade for movie operations,
 * delegating business logic to specific use cases for creating, finding, and listing movies.
 *
 * @module movies.service
 */

import { CreateMovieDto, ListMoviesWithPaginationDto } from '../dtos';
import { MovieSchema } from '../schemas';
import {
  CreateMovieUseCase,
  FindMovieByIdUseCase,
  ListMoviesWithPaginationUseCase,
} from '../use-cases';
import { Injectable } from '@nestjs/common';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';

/**
 * Service class responsible for managing movie-related operations.
 * Acts as a facade that delegates business logic to specific use cases.
 *
 * @class MoviesService
 * @decorator Injectable - Marks the class as a NestJS injectable provider.
 */
@Injectable()
export class MoviesService {
  /**
   * Creates an instance of MoviesService.
   *
   * @param {CreateMovieUseCase} createMovieUseCase - Use case for creating new movies.
   * @param {FindMovieByIdUseCase} findMovieByIdUseCase - Use case for finding movies by ID.
   * @param {ListMoviesWithPaginationUseCase} listMoviesWithPaginationUseCase - Use case for listing movies with pagination.
   */
  constructor(
    private readonly createMovieUseCase: CreateMovieUseCase,
    private readonly findMovieByIdUseCase: FindMovieByIdUseCase,
    private readonly listMoviesWithPaginationUseCase: ListMoviesWithPaginationUseCase,
  ) {}

  /**
   * Lists movies with pagination support.
   * Delegates the retrieval logic to the ListMoviesWithPaginationUseCase.
   *
   * @async
   * @param {ListMoviesWithPaginationDto} dto - The data transfer object containing pagination parameters.
   * @returns {Promise<PaginationResultDto<MovieSchema>>} A promise that resolves to a paginated result containing movies and metadata.
   *
   * @example
   * const result = await moviesService.listWithPagination({ page: 1, limit: 10 });
   * console.log(result.data); // Array of MovieSchema
   * console.log(result.metadata); // Pagination metadata
   */
  async listWithPagination(
    dto: ListMoviesWithPaginationDto,
  ): Promise<PaginationResultDto<MovieSchema>> {
    return this.listMoviesWithPaginationUseCase.execute(dto);
  }

  /**
   * Creates a new movie entity.
   * Delegates the creation logic to the CreateMovieUseCase.
   *
   * @async
   * @param {CreateMovieDto} data - The data transfer object containing movie creation details.
   * @returns {Promise<MovieSchema>} A promise that resolves to the newly created movie.
   * @throws {UnableToCreateMovieException} When the movie cannot be created in the database.
   *
   * @example
   * const movie = await moviesService.create({
   *   name: 'The Matrix',
   *   description: 'A sci-fi action film about a simulated reality'
   * });
   */
  async create(data: CreateMovieDto): Promise<MovieSchema> {
    return this.createMovieUseCase.execute(data);
  }

  /**
   * Finds a movie by its unique identifier.
   * Delegates the retrieval logic to the FindMovieByIdUseCase.
   *
   * @async
   * @param {string} id - The unique identifier of the movie to find.
   * @returns {Promise<MovieSchema>} A promise that resolves to the found movie entity.
   * @throws {MovieNotFoundException} When the movie with the specified id is not found.
   *
   * @example
   * const movie = await moviesService.findById('550e8400-e29b-41d4-a716-446655440000');
   * console.log(movie.name); // 'The Matrix'
   */
  async findById(id: string): Promise<MovieSchema> {
    return this.findMovieByIdUseCase.execute({ id });
  }
}
