/**
 * @fileoverview Interface for the list seats use case.
 *
 * @description
 * This file contains the interface definition for the list seats use case,
 * which defines the contract for listing all seats within a specific room.
 *
 * @module list-seats.interface
 */

import { ListSeatsDto } from '../dtos';
import { SeatSchema } from '../schemas';

/**
 * Interface for the list seats use case.
 *
 * @description
 * Defines the contract for use cases that list all seats within a specific room.
 * Implementations of this interface should retrieve all seats associated with
 * the provided room identifier.
 *
 * @interface IListSeatsUseCase
 *
 * @example
 * // Implementing the interface
 * class ListSeatsUseCase implements IListSeatsUseCase {
 *   async execute(data: ListSeatsDto): Promise<SeatSchema[]> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IListSeatsUseCase {
  /**
   * Executes the list seats use case.
   *
   * @param {ListSeatsDto} data - The data transfer object containing the room identifier.
   * @returns {Promise<SeatSchema[]>} A promise that resolves to an array of seats in the room.
   *
   * @example
   * const seats = await listSeatsUseCase.execute({
   *   roomId: '550e8400-e29b-41d4-a716-446655440000'
   * });
   * console.log(seats.length); // Number of seats in the room
   */
  execute(data: ListSeatsDto): Promise<SeatSchema[]>;
}
