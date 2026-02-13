/**
 * @fileoverview Service layer for room management operations.
 *
 * @description
 * This file contains the RoomsService class which acts as a facade
 * for room-related use cases, providing a unified interface for
 * room operations including creation, retrieval, and listing.
 *
 * @module rooms.service
 */

import { CreateRoomDto, ListRoomsWithPaginationDto } from '../dtos';
import { RoomSchema } from '../schemas';

import { CreateRoomUseCase } from '../use-cases/create-room.use-case';
import { FindRoomByIdUseCase } from '../use-cases/find-room-by-id.use-case';
import { ListRoomsWithPaginationUseCase } from '../use-cases/list-rooms-with-pagination.use-case';

import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { Injectable } from '@nestjs/common';

/**
 * Service class for managing room operations.
 *
 * @description
 * Provides a service layer that orchestrates room-related use cases.
 * Acts as an intermediary between controllers and use cases, following
 * the clean architecture pattern.
 *
 * @class RoomsService
 *
 * @example
 * // Inject and use in a controller
 * const roomsService = new RoomsService(
 *   createRoomUseCase,
 *   findRoomByIdUseCase,
 *   listRoomsWithPaginationUseCase,
 * );
 * const room = await roomsService.findRoomById('uuid');
 */
@Injectable()
export class RoomsService {
  /**
   * Creates an instance of RoomsService.
   *
   * @param {CreateRoomUseCase} createRoomUseCase - Use case for creating new rooms.
   * @param {FindRoomByIdUseCase} findRoomByIdUseCase - Use case for finding rooms by ID.
   * @param {ListRoomsWithPaginationUseCase} listRoomsWithPaginationUseCase - Use case for listing rooms with pagination.
   */
  constructor(
    private readonly createRoomUseCase: CreateRoomUseCase,
    private readonly findRoomByIdUseCase: FindRoomByIdUseCase,
    private readonly listRoomsWithPaginationUseCase: ListRoomsWithPaginationUseCase,
  ) {}

  /**
   * Finds a room by its unique identifier.
   *
   * @param {string} id - The unique identifier (UUID) of the room to find.
   * @returns {Promise<RoomSchema>} A promise that resolves to the found room.
   *
   * @example
   * const room = await roomsService.findById('550e8400-e29b-41d4-a716-446655440000');
   * console.log(room.name); // Room name
   */
  async findById(id: string): Promise<RoomSchema> {
    return this.findRoomByIdUseCase.execute({ id });
  }

  /**
   * Lists rooms with pagination support.
   *
   * @param {ListRoomsWithPaginationDto} pagination - The pagination parameters (page, limit).
   * @returns {Promise<PaginationResultDto<RoomSchema>>} A promise that resolves to a paginated result containing rooms and metadata.
   *
   * @example
   * const result = await roomsService.listWithPagination({ page: 1, limit: 10 });
   * console.log(result.data); // Array of rooms
   * console.log(result.metadata.totalPages); // Total number of pages
   */
  async listWithPagination(
    pagination: ListRoomsWithPaginationDto,
  ): Promise<PaginationResultDto<RoomSchema>> {
    return this.listRoomsWithPaginationUseCase.execute(pagination);
  }

  /**
   * Creates a new room.
   *
   * @param {CreateRoomDto} data - The data transfer object containing room creation details.
   * @returns {Promise<RoomSchema>} A promise that resolves to the newly created room.
   *
   * @example
   * const newRoom = await roomsService.create({ name: 'Room A', capacity: 100 });
   * console.log(newRoom.id); // UUID of the created room
   */
  async create(data: CreateRoomDto): Promise<RoomSchema> {
    return this.createRoomUseCase.execute(data);
  }
}
