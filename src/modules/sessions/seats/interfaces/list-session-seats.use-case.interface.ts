/**
 * @fileoverview Interface for the List Session Seats use case.
 *
 * @description
 * This file contains the interface for the List Session Seats use case.
 *
 * @module list-session-seats.use-case.interface
 */

import { ListSessionSeatsDto } from '../dtos';
import { SessionSeatSchemaWithRelations } from '../schemas';

/**
 * Interface for the List Session Seats use case.
 *
 * @description
 * Defines the contract for use cases that list the seats for a specific session.
 * Implementations of this interface should retrieve the seats for the specified session.
 *
 * @interface IListSessionSeatsUseCase
 */
export interface IListSessionSeatsUseCase {
  /**
   * Executes the list session seats use case.
   *
   * @param {ListSessionSeatsDto} data - The data transfer object containing the session identifier.
   * @returns {Promise<SessionSeatSchemaWithRelations[]>} A promise that resolves to an array of session seats.
   *
   * @example
   * const seats = await listSessionSeatsUseCase.execute({
   *   id: '550e8400-e29b-41d4-a716-446655440000'
   * });
   * console.log(seats.length); // Number of seats in the session
   */
  execute(data: ListSessionSeatsDto): Promise<SessionSeatSchemaWithRelations[]>;
}
