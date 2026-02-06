import { MovieSchema } from '../schemas';
import { FindMovieByIdDto } from '../dtos';

/**
 * Interface defining the contract for the Find Movie by Id use case.
 * Implements the use case pattern for finding a movie by its unique identifier.
 *
 * @interface IFindMovieByIdUseCase
 *
 * @example
 * class FindMovieByIdUseCase implements IFindMovieByIdUseCase {
 *   async execute(data: FindMovieByIdDto): Promise<MovieSchema> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IFindMovieByIdUseCase {
  /**
   * Executes the find movie by id use case.
   *
   * @param {FindMovieByIdDto} data - The data transfer object containing the id of the movie to find
   * @returns {Promise<MovieSchema>} A promise that resolves to the movie model
   *
   * @example
   * const movie = await findMovieByIdUseCase.execute({ id: '550e8400-e29b-41d4-a716-446655440000' });
   */
  execute(data: FindMovieByIdDto): Promise<MovieSchema>;
}
