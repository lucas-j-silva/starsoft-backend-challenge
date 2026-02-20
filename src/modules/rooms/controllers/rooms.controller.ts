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
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { RoomsService } from '../services/rooms.service';
import { RoomSchema } from '../schemas';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { CreateRoomDto, ListRoomsWithPaginationDto } from '../dtos';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { RoomApiSchema } from '../swagger/schemas/room.api-schema';
import { RoomsPaginationResultApiSchema } from '../swagger/schemas/rooms-pagination-result.api-schema';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

/**
 * Controller responsible for handling room-related HTTP requests.
 *
 * @description
 * This controller exposes REST API endpoints for room management operations.
 * It delegates business logic to the RoomsService.
 *
 * @class RoomsController
 * @decorator Controller - Marks the class as a NestJS controller with 'rooms' route prefix.
 */
@Controller('rooms')
@ApiCookieAuth()
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
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List rooms with pagination',
    description: 'Retrieves a paginated list of rooms',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The rooms have been successfully retrieved.',
    type: RoomsPaginationResultApiSchema,
  })
  @AllowAnonymous()
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
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find a room by ID',
    description: 'Retrieves a room by its unique identifier',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The room has been successfully retrieved.',
    type: RoomApiSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The room with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @AllowAnonymous()
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<RoomSchema> {
    return this.roomsService.findById(id);
  }

  /**
   * Creates a new room.
   *
   * @async
   * @param {CreateRoomDto} createRoomDto - The data transfer object containing room creation details.
   * @returns {Promise<RoomSchema>} A promise that resolves to the newly created room.
   * @throws {UnableToCreateRoomException} When the room cannot be created in the database.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new room',
    description: 'Creates a new room with the given name',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The room has been successfully created.',
    type: RoomApiSchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The room cannot be created.',
  })
  async create(@Body() createRoomDto: CreateRoomDto): Promise<RoomSchema> {
    return this.roomsService.create(createRoomDto);
  }
}
