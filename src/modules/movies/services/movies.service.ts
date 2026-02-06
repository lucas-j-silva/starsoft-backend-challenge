import { CreateMovieDto } from '../dtos';
import { MovieSchema } from '../schemas';
import { CreateMovieUseCase, FindMovieByIdUseCase } from '../use-cases';
import { Injectable } from '@nestjs/common';

/**
 * Service class responsible for managing movie-related operations.
 * Acts as a facade that delegates business logic to specific use cases.
 *
 * @class MoviesService
 * @decorator Injectable - Marks the class as a NestJS injectable provider.
 *
 * @example
 * // Inject and use in a controller
 * constructor(private readonly moviesService: MoviesService) {}
 *
 * // Create a new movie
 * const movie = await this.moviesService.create({
 *   name: 'Inception',
 *   description: 'A mind-bending thriller'
 * });
 *
 * // Find a movie by ID
 * const movie = await this.moviesService.findById('550e8400-e29b-41d4-a716-446655440000');
 */
@Injectable()
export class MoviesService {
  /**
   * Creates an instance of MoviesService.
   *
   * @param {CreateMovieUseCase} createMovieUseCase - Use case for creating new movies.
   * @param {FindMovieByIdUseCase} findMovieByIdUseCase - Use case for finding movies by ID.
   */
  constructor(
    private readonly createMovieUseCase: CreateMovieUseCase,
    private readonly findMovieByIdUseCase: FindMovieByIdUseCase,
  ) {}

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
