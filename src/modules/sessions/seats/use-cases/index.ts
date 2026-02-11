/**
 * @fileoverview Barrel file for session seats use cases.
 *
 * @description
 * This file exports all use cases related to session seats management,
 * including listing, reserving, and creating session seats. It provides
 * a centralized export point for dependency injection and module imports.
 *
 * @module session-seats-use-cases
 */

import { ListSessionSeatsUseCase } from './list-session-seats.use-case';
import { ReserveSessionSeatUseCase } from './reserve-session-seat.use-case';
import { CreateManySessionSeatsUseCase } from './create-many-session-seats.use-case';

/**
 * Array of all session seats use case providers.
 *
 * @description
 * Contains all use case classes for session seats operations.
 * Used for registering providers in the NestJS module.
 *
 * @constant {Array<Type>} SessionSeatsUseCases
 *
 * @example
 * ```typescript
 * // Import in a module
 * @Module({
 *   providers: [...SessionSeatsUseCases],
 * })
 * export class SessionSeatsModule {}
 * ```
 */
export const SessionSeatsUseCases = [
  ListSessionSeatsUseCase,
  ReserveSessionSeatUseCase,
  CreateManySessionSeatsUseCase,
];
