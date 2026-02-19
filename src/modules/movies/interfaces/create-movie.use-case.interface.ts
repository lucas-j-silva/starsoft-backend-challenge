/**
 * @fileoverview Interface defining the contract for the Create Movie use case.
 *
 * @description
 * This file contains the interface that any Create Movie use case implementation
 * must satisfy, ensuring a consistent API for movie creation across the module.
 *
 * @module create-movie.use-case.interface
 */

import { CreateMovieDto } from '../dtos';
import { MovieSchema } from '../schemas';

/**
 * Interface defining the contract for the Create Movie use case.
 * Implements the use case pattern for creating new movie entities.
 *
 * @interface ICreateMovieUseCase
 *
 * @example
 * class CreateMovieUseCase implements ICreateMovieUseCase {
 *   async execute(data: CreateMovieDto): Promise<MovieSchema> {
 *     // Implementation logic
 *   }
 * }
 */
export interface ICreateMovieUseCase {
  /**
   * Executes the create movie use case.
   *
   * @param {CreateMovieDto} data - The data transfer object containing movie creation details
   * @returns {Promise<MovieSchema>} A promise that resolves to the newly created movie model
   *
   * @example
   * const movie = await createMovieUseCase.execute({
   *   name: 'Inception',
   *   description: 'A mind-bending thriller'
   * });
   */
  execute(data: CreateMovieDto): Promise<MovieSchema>;
}
