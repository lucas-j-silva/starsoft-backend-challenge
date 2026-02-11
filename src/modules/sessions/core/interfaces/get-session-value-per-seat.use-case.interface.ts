/**
 * @fileoverview Interface for the Get Session Value Per Seat use case.
 *
 * @description
 * This file contains the interface for the Get Session Value Per Seat use case.
 *
 * @module get-session-value-per-seat.use-case.interface
 */

import { GetSessionValuePerSeatDto } from '../dtos';

/**
 * Interface for the Get Session Value Per Seat use case.
 *
 * @description
 * Defines the contract for use cases that get the value per seat for a session.
 * Implementations of this interface should get the value per seat for the specified session.
 *
 * @interface IGetSessionValuePerSeatUseCase
 *
 * @example
 * class GetSessionValuePerSeatUseCase implements IGetSessionValuePerSeatUseCase {
 *   async execute(data: GetSessionValuePerSeatDto): Promise<number> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IGetSessionValuePerSeatUseCase {
  /**
   * Executes the get session value per seat use case.
   *
   * @param {GetSessionValuePerSeatDto} data - The data transfer object containing the session identifier.
   * @returns {Promise<number>} A promise that resolves to the value per seat for the specified session.
   *
   * @example
   * const valuePerSeat = await getSessionValuePerSeatUseCase.execute({ id: '550e8400-e29b-41d4-a716-446655440000' });
   */
  execute(data: GetSessionValuePerSeatDto): Promise<number>;
}
