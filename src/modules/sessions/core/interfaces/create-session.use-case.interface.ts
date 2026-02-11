/**
 * @fileoverview Interfaces for the Create Session use case.
 *
 * @description
 * This file contains the interfaces for the Create Session use case.
 *
 * @module create-session.use-case.interface
 */

import { CreateSessionDto } from '../dtos';
import { SessionSchema } from '../schemas';

/**
 * Interface for the Create Session use case.
 *
 * @description
 * Defines the contract for use cases that create new session entities.
 * Implementations of this interface should create a new session based on the provided criteria.
 *
 * @interface ICreateSessionUseCase
 *
 * @example
 * class CreateSessionUseCase implements ICreateSessionUseCase {
 *   async execute(data: CreateSessionDto): Promise<SessionSchema> {
 *     // Implementation logic
 *   }
 * }
 */
export interface ICreateSessionUseCase {
  /**
   * Executes the create session use case.
   *
   * @param {CreateSessionDto} data - The data transfer object containing session creation details.
   * @returns {Promise<SessionSchema>} A promise that resolves to the newly created session.
   *
   * @example
   * const session = await createSessionUseCase.execute({
   *   movieId: '550e8400-e29b-41d4-a716-446655440000',
   *   roomId: '660e8400-e29b-41d4-a716-446655440001',
   *   valuePerSeatInCents: 2500,
   *   startTime: new Date('2024-01-15T19:00:00Z'),
   * });
   */
  execute(data: CreateSessionDto): Promise<SessionSchema>;
}
