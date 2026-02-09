/**
 * @fileoverview Interfaces for the Find Room use case.
 *
 * @description
 * This file contains the interfaces for the Find Room use case.
 *
 * @module find-room.use-case.interface
 */

import { FindRoomByIdDto } from '../dtos';
import { RoomSchema } from '../schemas';

/**
 * Interface defining the contract for the Find Room use case.
 * Implements the use case pattern for finding a room by its unique identifier.
 *
 * @interface IFindRoomUseCase
 *
 * @example
 * class FindRoomUseCase implements IFindRoomUseCase {
 *   async execute(data: FindRoomByIdDto): Promise<RoomSchema> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IFindRoomUseCase {
  /**
   * Executes the find room use case.
   *
   * @param {FindRoomByIdDto} data - The data transfer object containing the id of the room to find.
   * @returns {Promise<RoomSchema>} A promise that resolves to the room model.
   *
   * @example
   * const room = await findRoomUseCase.execute({ id: '550e8400-e29b-41d4-a716-446655440000' });
   */
  execute(data: FindRoomByIdDto): Promise<RoomSchema>;
}
