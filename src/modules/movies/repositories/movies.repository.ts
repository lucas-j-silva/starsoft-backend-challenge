/**
 * @fileoverview Repository for managing movie entities in the database.
 *
 * @description
 * This file contains the MoviesRepository class which provides data access
 * methods for movie entities, including CRUD operations and pagination.
 *
 * @module movies.repository
 */

import { Injectable } from '@nestjs/common';
import { MovieInsertSchema, MovieSchema, moviesTable } from '../schemas';
import { eq } from 'drizzle-orm';
import { MovieNotFoundException } from '../exceptions';
import { UnableToCreateMovieException } from '../exceptions/unable-to-create-movie.exception';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DatabaseTransactionAdapter } from '../../../shared/database/database.provider';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';

/**
 * Repository class for managing movie data persistence operations.
 * Provides methods for CRUD operations on the movies table using Drizzle ORM.
 *
 * @class MoviesRepository
 * @injectable
 */
@Injectable()
export class MoviesRepository {
  /**
   * Creates an instance of MoviesRepository.
   *
   * @param {TransactionHost<DatabaseTransactionAdapter>} txHost - The transaction host for database operations.
   */
  constructor(
    private readonly txHost: TransactionHost<DatabaseTransactionAdapter>,
  ) {}

  /**
   * Lists movies with pagination support.
   *
   * @param {PaginationDto} pagination - The pagination parameters.
   * @param {number} [pagination.page=1] - The page number to retrieve.
   * @param {number} [pagination.limit=10] - The number of items per page.
   * @returns {Promise<PaginationResultDto<MovieSchema>>} A promise that resolves to a paginated result containing movies and metadata.
   *
   * @example
   * const result = await moviesRepository.listWithPagination({ page: 1, limit: 10 });
   * console.log(result.data); // Array of MovieSchema
   * console.log(result.metadata); // Pagination metadata
   */
  async listWithPagination(
    pagination: PaginationDto,
  ): Promise<PaginationResultDto<MovieSchema>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const offset = (page - 1) * limit;

    const count = await this.txHost.tx.$count(moviesTable);
    const totalPages = Math.ceil(count / limit);
    const movies = await this.txHost.tx
      .select()
      .from(moviesTable)
      .limit(limit)
      .offset(offset)
      .then((results) => results);

    return new PaginationResultDto<MovieSchema>({
      data: movies,
      metadata: {
        currentPage: page,
        totalPages: totalPages,
        limit: limit,
      },
    });
  }

  /**
   * Finds a movie by its unique identifier.
   *
   * @async
   * @param {string} id - The UUID of the movie to find.
   * @returns {Promise<MovieSchema>} A promise that resolves to the found movie.
   * @throws {MovieNotFoundException} When no movie is found with the given ID.
   *
   * @example
   * const movie = await moviesRepository.findById('550e8400-e29b-41d4-a716-446655440000');
   * console.log(movie.name); // 'Movie Title'
   */
  async findById(id: string): Promise<MovieSchema> {
    const [movie] = await this.txHost.tx
      .select()
      .from(moviesTable)
      .where(eq(moviesTable.id, id));

    if (!movie) throw new MovieNotFoundException(id);

    return movie;
  }

  /**
   * Inserts a new movie into the database.
   *
   * @async
   * @param {MovieInsertSchema} data - The movie data to insert, containing name and description.
   * @returns {Promise<MovieSchema>} A promise that resolves to the newly created movie with generated ID and timestamps.
   * @throws {UnableToCreateMovieException} When the movie cannot be created in the database.
   *
   * @example
   * const newMovie = await moviesRepository.insert({
   *   name: 'Inception',
   *   description: 'A mind-bending thriller'
   * });
   * console.log(newMovie.id); // '550e8400-e29b-41d4-a716-446655440000'
   */
  async insert(data: MovieInsertSchema): Promise<MovieSchema> {
    const [movie] = await this.txHost.tx
      .insert(moviesTable)
      .values(data)
      .returning();

    if (!movie) throw new UnableToCreateMovieException();

    return movie;
  }
}
