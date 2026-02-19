/**
 * @fileoverview Interfaces for the Find Session use case.
 *
 * @description
 * This file contains the interfaces for the Find Session use case.
 *
 * @module find-session.use-case.interface
 */

import { FindSessionDto } from '../dtos';
import { SessionSchema } from '../schemas';

/**
 * Interface for the Find Session use case.
 *
 * @description
 * Defines the contract for use cases that find existing session entities.
 * Implementations of this interface should retrieve a session based on the provided criteria.
 *
 * @interface IFindSessionUseCase
 *
 * @example
 * class FindSessionUseCase implements IFindSessionUseCase {
 *   async execute(dto: FindSessionDto): Promise<SessionSchema> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IFindSessionUseCase {
  /**
   * Executes the find session use case.
   *
   * @param {FindSessionDto} dto - The data transfer object containing session search criteria.
   * @returns {Promise<SessionSchema>} A promise that resolves to the found session.
   *
   * @throws {SessionNotFoundException} When the session cannot be found.
   *
   * @example
   * const session = await findSessionUseCase.execute({
   *   id: '550e8400-e29b-41d4-a716-446655440000',
   * });
   */
  execute(dto: FindSessionDto): Promise<SessionSchema>;
}
