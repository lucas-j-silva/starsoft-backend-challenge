/**
 * @fileoverview Barrel file for rooms module use cases.
 *
 * @description
 * This file serves as the central export point for all use cases related to
 * rooms and seats management. It provides convenient arrays for dependency
 * injection and re-exports all use case classes for external consumption.
 *
 * @module rooms/use-cases
 */

import { CreateRoomUseCase } from './create-room.use-case';
import { FindRoomByIdUseCase } from './find-room-by-id.use-case';
import { CreateSeatUseCase } from './create-seat.use-case';
import { ListRoomsWithPaginationUseCase } from './list-rooms-with-pagination.use-case';
import { ListSeatsWithPaginationUseCase } from './list-seats-with-pagination.use-case';
import { ListSeatsUseCase } from './list-seats.use-case';

/**
 * Array of all room-related use case classes.
 *
 * @description
 * This array contains all use cases that handle room operations.
 * It is designed to be used with NestJS module providers for dependency injection.
 *
 * @constant {Array<Type>} RoomsUseCases
 *
 * @example
 * // Use in a NestJS module
 * @Module({
 *   providers: [...RoomsUseCases],
 * })
 * export class RoomsModule {}
 */
export const RoomsUseCases = [
  CreateRoomUseCase,
  FindRoomByIdUseCase,
  ListRoomsWithPaginationUseCase,
];

/**
 * Array of all seat-related use case classes.
 *
 * @description
 * This array contains all use cases that handle seat operations within rooms.
 * It is designed to be used with NestJS module providers for dependency injection.
 *
 * @constant {Array<Type>} SeatsUseCases
 *
 * @example
 * // Use in a NestJS module
 * @Module({
 *   providers: [...SeatsUseCases],
 * })
 * export class SeatsModule {}
 */
export const SeatsUseCases = [
  CreateSeatUseCase,
  ListSeatsUseCase,
  ListSeatsWithPaginationUseCase,
];

// Re-export all use cases for external consumption
export * from './create-room.use-case';
export * from './find-room-by-id.use-case';
export * from './create-seat.use-case';
export * from './list-rooms-with-pagination.use-case';
export * from './list-seats-with-pagination.use-case';
export * from './list-seats.use-case';
