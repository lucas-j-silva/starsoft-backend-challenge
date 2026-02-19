/**
 * @fileoverview Use case for finding a movie by its unique identifier.
 *
 * @description
 * This file contains the use case implementation for finding a movie by its unique identifier.
 *
 * @module find-movie-by-id.use-case
 */

import { Injectable } from '@nestjs/common';
import { FindMovieByIdDto } from '../dtos';
import { IFindMovieByIdUseCase } from '../interfaces';
import { MoviesRepository } from '../repositories';
import { MovieSchema } from '../schemas';

/**
 * Use case class responsible for finding a movie by its unique identifier.
 * Implements the IFindMovieByIdUseCase interface to follow the use case pattern.
 *
 * @class FindMovieByIdUseCase
 * @implements {IFindMovieByIdUseCase}
 *
 * @example
 * // Inject and use in a controller or service
 * const findMovieByIdUseCase = new FindMovieByIdUseCase(moviesRepository);
 * const movie = await findMovieByIdUseCase.execute({
 *   id: '550e8400-e29b-41d4-a716-446655440000'
 * });
 */
@Injectable()
export class FindMovieByIdUseCase implements IFindMovieByIdUseCase {
  /**
   * Creates an instance of FindMovieByIdUseCase.
   *
   * @param {MoviesRepository} moviesRepository - The repository for movie data persistence operations.
   */
  constructor(private readonly moviesRepository: MoviesRepository) {}

  /**
   * Executes the find movie by id use case.
   * Retrieves a movie entity from the database by its unique identifier.
   *
   * @async
   * @param {FindMovieByIdDto} data - The data transfer object containing the movie id to find.
   * @returns {Promise<MovieSchema>} A promise that resolves to the found movie entity.
   * @throws {MovieNotFoundException} When the movie with the specified id is not found.
   *
   * @example
   * const movie = await findMovieByIdUseCase.execute({
   *   id: '550e8400-e29b-41d4-a716-446655440000'
   * });
   * console.log(movie.name); // 'The Matrix'
   */
  async execute(data: FindMovieByIdDto): Promise<MovieSchema> {
    const movie = await this.moviesRepository.findById(data.id);

    return movie;
  }
}
