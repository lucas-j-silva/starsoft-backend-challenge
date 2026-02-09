/**
 * @fileoverview Use case for creating a new room.
 *
 * @description
 * This file contains the use case implementation for creating new room entities.
 */

import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from '../dtos';
import { ICreateRoomUseCase } from '../interfaces';
import { RoomsRepository } from '../repositories';
import { RoomSchema } from '../schemas';

/**
 * Use case class for creating new room entities.
 * Implements the ICreateRoomUseCase interface to handle room creation logic.
 *
 * @class CreateRoomUseCase
 * @implements {ICreateRoomUseCase}
 *
 * @example
 * // Inject and use in a controller or service
 * const createRoomUseCase = new CreateRoomUseCase(roomsRepository);
 * const newRoom = await createRoomUseCase.execute({ name: 'Conference Room A' });
 * console.log(newRoom.id); // '550e8400-e29b-41d4-a716-446655440000'
 */
@Injectable()
export class CreateRoomUseCase implements ICreateRoomUseCase {
  /**
   * Creates an instance of CreateRoomUseCase.
   *
   * @param {RoomsRepository} roomsRepository - The repository for room data persistence operations.
   */
  constructor(private readonly roomsRepository: RoomsRepository) {}

  /**
   * Executes the create room use case.
   *
   * @async
   * @param {CreateRoomDto} data - The data transfer object containing room creation details.
   * @returns {Promise<RoomSchema>} A promise that resolves to the newly created room with generated ID and timestamps.
   * @throws {UnableToCreateRoomException} When the room cannot be created in the database.
   *
   * @example
   * const newRoom = await createRoomUseCase.execute({ name: 'Meeting Room 1' });
   * console.log(newRoom.name); // 'Meeting Room 1'
   */
  async execute(data: CreateRoomDto): Promise<RoomSchema> {
    const room = await this.roomsRepository.insert(data);

    return room;
  }
}
