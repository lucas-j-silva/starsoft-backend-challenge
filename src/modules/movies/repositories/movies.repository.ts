import { Injectable } from '@nestjs/common';
import { DrizzleClientService } from 'src/shared/database/drizzle-client.service';
import { MovieInsertSchema, MovieSchema, moviesTable } from '../schemas';
import { eq } from 'drizzle-orm';
import { MovieNotFoundException } from '../exceptions';
import { UnableToCreateMovieException } from '../exceptions/unable-to-create-movie.exception';

/**
 * Repository class for managing movie data persistence operations.
 * Provides methods for CRUD operations on the movies table using Drizzle ORM.
 *
 * @class MoviesRepository
 * @injectable
 *
 * @example
 * // Inject and use in a service
 * constructor(private readonly moviesRepository: MoviesRepository) {}
 *
 * // Find a movie by ID
 * const movie = await this.moviesRepository.findById('123e4567-e89b-12d3-a456-426614174000');
 *
 * // Insert a new movie
 * const newMovie = await this.moviesRepository.insert({ name: 'Movie Title', description: 'Description' });
 */
@Injectable()
export class MoviesRepository {
  /**
   * Creates an instance of MoviesRepository.
   *
   * @param {DrizzleClientService} drizzleClient - The Drizzle ORM client service for database operations.
   */
  constructor(private readonly drizzleClient: DrizzleClientService) {}

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
    const movie = await this.drizzleClient
      .getInstance()
      .select()
      .from(moviesTable)
      .where(eq(moviesTable.id, id))
      .then((results) => results[0]);

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
    const movie = await this.drizzleClient
      .getInstance()
      .insert(moviesTable)
      .values(data)
      .returning()
      .then((results) => results[0]);

    if (!movie) throw new UnableToCreateMovieException();

    return movie;
  }
}
