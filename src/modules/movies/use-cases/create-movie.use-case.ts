import { ICreateMovieUseCase } from '../interfaces';
import { MoviesRepository } from '../repositories';
import { CreateMovieDto } from '../dtos';
import { MovieSchema } from '../schemas';
import { Injectable } from '@nestjs/common';

/**
 * Use case class responsible for creating new movie entities.
 * Implements the ICreateMovieUseCase interface to follow the use case pattern.
 *
 * @class CreateMovieUseCase
 * @implements {ICreateMovieUseCase}
 *
 * @example
 * // Inject and use in a controller or service
 * const createMovieUseCase = new CreateMovieUseCase(moviesRepository);
 * const movie = await createMovieUseCase.execute({
 *   name: 'Inception',
 *   description: 'A mind-bending thriller'
 * });
 */
@Injectable()
export class CreateMovieUseCase implements ICreateMovieUseCase {
  /**
   * Creates an instance of CreateMovieUseCase.
   *
   * @param {MoviesRepository} moviesRepository - The repository for movie data persistence operations.
   */
  constructor(private readonly moviesRepository: MoviesRepository) {}

  /**
   * Executes the create movie use case.
   * Creates a new movie entity with the provided data and persists it to the database.
   *
   * @async
   * @param {CreateMovieDto} data - The data transfer object containing movie creation details.
   * @returns {Promise<MovieSchema>} A promise that resolves to the newly created movie with generated ID and timestamps.
   * @throws {UnableToCreateMovieException} When the movie cannot be created in the database.
   *
   * @example
   * const movie = await createMovieUseCase.execute({
   *   name: 'The Matrix',
   *   description: 'A sci-fi action film about a simulated reality'
   * });
   * console.log(movie.id); // '550e8400-e29b-41d4-a716-446655440000'
   */
  async execute(data: CreateMovieDto): Promise<MovieSchema> {
    const movie = await this.moviesRepository.insert({
      name: data.name,
      description: data.description,
    });

    return movie;
  }
}
