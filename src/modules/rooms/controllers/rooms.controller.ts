/**
 * @fileoverview Controller for managing room-related HTTP endpoints.
 *
 * @description
 * This file contains the RoomsController class which handles all HTTP requests
 * related to room operations including listing, finding, and creating rooms.
 *
 * @module rooms.controller
 */

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { RoomsService } from '../services/rooms.service';
import { RoomSchema } from '../schemas';
import { PaginationResultDto } from 'src/shared/dtos/pagination-result.dto';
import { CreateRoomDto, ListRoomsWithPaginationDto } from '../dtos';

/**
 * Controller responsible for handling room-related HTTP requests.
 *
 * @description
 * This controller exposes REST API endpoints for room management operations.
 * It delegates business logic to the RoomsService.
 *
 * @class RoomsController
 * @decorator Controller - Marks the class as a NestJS controller with 'rooms' route prefix.
 *
 * @example
 * // GET /rooms - List rooms with pagination
 * // GET /rooms/:id - Find a room by ID
 * // POST /rooms - Create a new room
 */
@Controller('rooms')
export class RoomsController {
  /**
   * Creates an instance of RoomsController.
   *
   * @param {RoomsService} roomsService - The service for room-related operations.
   */
  constructor(private readonly roomsService: RoomsService) {}

  /**
   * Retrieves a paginated list of rooms.
   *
   * @async
   * @param {ListRoomsWithPaginationDto} query - The pagination parameters from query string.
   * @returns {Promise<PaginationResultDto<RoomSchema>>} A promise that resolves to a paginated result containing rooms.
   *
   * @example
   * // GET /rooms?page=1&limit=10
   * // Response: { data: [...], metadata: { page: 1, limit: 10, total: 100 } }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async listWithPagination(
    @Query() query: ListRoomsWithPaginationDto,
  ): Promise<PaginationResultDto<RoomSchema>> {
    return this.roomsService.listWithPagination(query);
  }

  /**
   * Retrieves a room by its unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier of the room.
   * @returns {Promise<RoomSchema>} A promise that resolves to the found room.
   * @throws {RoomNotFoundException} When the room with the specified ID is not found.
   *
   * @example
   * // GET /rooms/550e8400-e29b-41d4-a716-446655440000
   * // Response: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Room A', ... }
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<RoomSchema> {
    return this.roomsService.findById(id);
  }

  /**
   * Creates a new room.
   *
   * @async
   * @param {CreateRoomDto} createRoomDto - The data transfer object containing room creation details.
   * @returns {Promise<RoomSchema>} A promise that resolves to the newly created room.
   * @throws {UnableToCreateRoomException} When the room cannot be created in the database.
   *
   * @example
   * // POST /rooms
   * // Body: { name: 'Room A', capacity: 100 }
   * // Response: { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Room A', capacity: 100, ... }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoomDto: CreateRoomDto): Promise<RoomSchema> {
    return this.roomsService.create(createRoomDto);
  }
}
