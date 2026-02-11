/**
 * @fileoverview Interface for the Create Many Session Seats use case.
 *
 * @description
 * This file contains the interface for the Create Many Session Seats use case.
 *
 * @module create-many-session-seats.use-case.interface
 */

import { CreateManySessionSeatsDto } from '../dtos';
import { SessionSeatSchema } from '../schemas';

/**
 * Interface for the use case responsible for creating multiple session seats.
 *
 * @interface ICreateManySessionSeatsUseCase
 *
 * @example
 * class CreateManySessionSeatsUseCase implements ICreateManySessionSeatsUseCase {
 *   async execute(data: CreateManySessionSeatsDto): Promise<SessionSeatSchema[]> {
 *     // Implementation
 *   }
 * }
 */
export interface ICreateManySessionSeatsUseCase {
  /**
   * Executes the creation of multiple session seats.
   *
   * @param {CreateManySessionSeatsDto} data - The data transfer object containing the details for creating multiple session seats.
   * @returns {Promise<SessionSeatSchema[]>} A promise that resolves to an array of created session seat schemas.
   *
   * @example
   * const sessionSeats = await createManySessionSeatsUseCase.execute({
   *   sessionId: '550e8400-e29b-41d4-a716-446655440000',
   *   seats: [
   *     { seatId: '660e8400-e29b-41d4-a716-446655440001', isAvailable: true },
   *     { seatId: '660e8400-e29b-41d4-a716-446655440002', isAvailable: true }
   *   ]
   * });
   */
  execute(data: CreateManySessionSeatsDto): Promise<SessionSeatSchema[]>;
}
