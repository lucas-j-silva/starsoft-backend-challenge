/**
 * @fileoverview Interfaces for the Create Room use case.
 *
 * @description
 * This file contains the interfaces for the Create Room use case.
 *
 * @module create-room.use-case.interface
 */

import { CreateRoomDto } from '../dtos';
import { RoomSchema } from '../schemas';

/**
 * Interface defining the contract for the Create Room use case.
 * Implements the use case pattern for creating new room entities.
 *
 * @interface ICreateRoomUseCase
 *
 * @example
 * class CreateRoomUseCase implements ICreateRoomUseCase {
 *   async execute(data: CreateRoomDto): Promise<RoomSchema> {
 *     // Implementation logic
 *   }
 * }
 */
export interface ICreateRoomUseCase {
  /**
   * Executes the create room use case.
   *
   * @param {CreateRoomDto} data - The data transfer object containing room creation details.
   * @returns {Promise<RoomSchema>} A promise that resolves to the newly created room with generated ID and timestamps.
   * @throws {UnableToCreateRoomException} When the room cannot be created in the database.
   */
  execute(data: CreateRoomDto): Promise<RoomSchema>;
}
