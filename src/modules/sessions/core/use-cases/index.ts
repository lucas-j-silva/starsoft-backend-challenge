/**
 * @fileoverview Barrel file for session core use cases.
 *
 * @description
 * This file exports all use cases related to session management,
 * including creating, listing, updating sessions, and calculating
 * session value per seat. It provides a centralized export point
 * for dependency injection and module imports.
 *
 * @module sessions-use-cases
 */

import { CreateSessionUseCase } from './create-session.use-case';
import { ListSessionsWithPaginationUseCase } from './list-sessions-with-pagination.use-case';
import { UpdateSessionUseCase } from './update-session.use-case';
import { GetSessionValuePerSeatUseCase } from './get-session-value-per-seat.use-case';

/**
 * Array of all session use case providers.
 *
 * @description
 * Contains all use case classes for session operations.
 * Used for registering providers in the NestJS module.
 *
 * @constant {Array<Type>} SessionsUseCases
 *
 * @example
 * ```typescript
 * // Import in a module
 * @Module({
 *   providers: [...SessionsUseCases],
 * })
 * export class SessionsModule {}
 * ```
 */
export const SessionsUseCases = [
  CreateSessionUseCase,
  ListSessionsWithPaginationUseCase,
  UpdateSessionUseCase,
  GetSessionValuePerSeatUseCase,
];
