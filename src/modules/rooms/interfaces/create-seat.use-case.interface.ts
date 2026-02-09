/**
 * @fileoverview Interfaces for the Create Seat use case.
 *
 * @description
 * This file contains the interfaces for the Create Seat use case.
 *
 * @module create-seat.use-case.interface
 */

import { CreateSeatDto } from '../dtos';
import { SeatSchema } from '../schemas';

/**
 * Interface defining the contract for the Create Seat use case.
 * Implements the use case pattern for creating new seat entities.
 *
 * @interface ICreateSeatUseCase
 *
 * @example
 * class CreateSeatUseCase implements ICreateSeatUseCase {
 *   async execute(data: CreateSeatDto): Promise<SeatSchema> {
 *     // Implementation logic
 *   }
 * }
 */
export interface ICreateSeatUseCase {
  /**
   * Executes the create seat use case.
   *
   * @param {CreateSeatDto} data - The data transfer object containing seat creation details.
   * @returns {Promise<SeatSchema>} A promise that resolves to the newly created seat.
   *
   * @example
   * const seat = await createSeatUseCase.execute({ roomId: '550e8400-e29b-41d4-a716-446655440000', row: 'A', column: 1 });
   */
  execute(data: CreateSeatDto): Promise<SeatSchema>;
}
