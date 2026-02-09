/**
 * @fileoverview Use case for finding a room by its unique identifier.
 *
 * @description
 * This file contains the use case implementation for finding a room by its unique identifier.
 *
 * @module find-room-by-id.use-case
 */

import { IFindRoomUseCase } from '../interfaces';
import { RoomsRepository } from '../repositories';
import { RoomSchema } from '../schemas';
import { FindRoomByIdDto } from '../dtos';
import { Injectable } from '@nestjs/common';

/**
 * Use case class for finding a room by its unique identifier.
 * Implements the IFindRoomUseCase interface to follow the use case pattern.
 *
 * @class FindRoomByIdUseCase
 * @implements {IFindRoomUseCase}
 *
 * @example
 * // Inject and use in a controller or service
 * const findRoomByIdUseCase = new FindRoomByIdUseCase(roomsRepository);
 * const room = await findRoomByIdUseCase.execute({ id: '550e8400-e29b-41d4-a716-446655440000' });
 * console.log(room.name); // 'Room 1'
 */
@Injectable()
export class FindRoomByIdUseCase implements IFindRoomUseCase {
  /**
   * Creates an instance of FindRoomByIdUseCase.
   *
   * @param {RoomsRepository} roomsRepository - The repository for room data persistence operations.
   */
  constructor(private readonly roomsRepository: RoomsRepository) {}

  /**
   * Executes the find room by id use case.
   *
   * @async
   * @param {FindRoomByIdDto} data - The data transfer object containing the id of the room to find.
   * @returns {Promise<RoomSchema>} A promise that resolves to the room model.
   *
   * @example
   * const room = await findRoomByIdUseCase.execute({ id: '550e8400-e29b-41d4-a716-446655440000' });
   * console.log(room.name); // 'Room 1'
   */
  async execute(data: FindRoomByIdDto): Promise<RoomSchema> {
    const room = await this.roomsRepository.findById(data.id);

    return room;
  }
}
