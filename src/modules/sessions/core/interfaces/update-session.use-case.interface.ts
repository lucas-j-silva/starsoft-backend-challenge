/**
 * @fileoverview Interface for the Update Session use case.
 *
 * @description
 * This file contains the interface for the Update Session use case.
 *
 * @module update-session.use-case.interface
 */

import { UpdateSessionDto } from '../dtos';
import { SessionSchema } from '../schemas';

/**
 * Interface for the Update Session use case.
 *
 * @description
 * Defines the contract for use cases that update existing session entities.
 * Implementations of this interface should update the session based on the provided criteria.
 *
 * @interface IUpdateSessionUseCase
 *
 * @example
 * class UpdateSessionUseCase implements IUpdateSessionUseCase {
 *   async execute(data: UpdateSessionDto): Promise<SessionSchema> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IUpdateSessionUseCase {
  /**
   * Executes the update session use case.
   *
   * @param {UpdateSessionDto} data - The data transfer object containing session update details.
   * @returns {Promise<SessionSchema>} A promise that resolves to the updated session.
   *
   * @example
   * const session = await updateSessionUseCase.execute({
   *   id: '550e8400-e29b-41d4-a716-446655440000',
   *   valuePerSeatInCents: 2500,
   *   startTime: new Date('2024-12-25T19:00:00'),
   * });
   */
  execute(data: UpdateSessionDto): Promise<SessionSchema>;
}
