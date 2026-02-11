/**
 * @fileoverview Controller for managing sessions.
 *
 * @description
 * This file contains the controller responsible for handling HTTP requests
 * related to session operations. It provides endpoints for listing, creating,
 * and updating movie sessions.
 *
 * @module sessions.controller
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
  Put,
  Query,
} from '@nestjs/common';
import { SessionsService } from '../services/sessions.service';
import { CreateSessionDto, ListSessionsWithPaginationDto } from '../dtos';
import { SessionSchema } from '../schemas';
import { PaginationResultDto } from 'src/shared/dtos/pagination-result.dto';
import { UpdateSessionBodyDto } from '../dtos';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  SessionApiSchema,
  SessionsPaginationResultApiSchema,
} from '../swagger/schemas/session-api-schema';

/**
 * Controller responsible for handling HTTP requests related to sessions.
 * Provides endpoints for listing, creating, and updating movie sessions.
 *
 * @class SessionsController
 */
@Controller('sessions')
export class SessionsController {
  /**
   * Creates an instance of SessionsController.
   *
   * @param {SessionsService} sessionsService - The service responsible for session business logic
   */
  constructor(private readonly sessionsService: SessionsService) {}

  /**
   * Lists all sessions with pagination support.
   *
   * @param {ListSessionsWithPaginationDto} listSessionsWithPaginationDto - DTO containing pagination parameters
   * @returns {Promise<PaginationResultDto<SessionSchema>>} Paginated list of sessions
   *
   * @example
   * // GET /sessions?page=1&limit=10
   * // Returns: { data: SessionSchema[], metadata: {...} }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List sessions with pagination',
    description: 'Lists all sessions with pagination',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sessions listed successfully',
    type: SessionsPaginationResultApiSchema,
  })
  async listWithPagination(
    @Query() listSessionsWithPaginationDto: ListSessionsWithPaginationDto,
  ): Promise<PaginationResultDto<SessionSchema>> {
    return this.sessionsService.listWithPagination(
      listSessionsWithPaginationDto,
    );
  }

  /**
   * Creates a new session with the specified movie and room.
   *
   * @param {CreateSessionDto} createSessionDto - DTO containing session creation data (movie, room, schedule)
   * @returns {Promise<SessionSchema>} The newly created session
   * @throws {BadRequestException} When the session cannot be created (e.g., scheduling conflict)
   *
   * @example
   * // POST /sessions
   * // Body: { movieId: "uuid", roomId: "uuid", startTime: "2024-01-01T10:00:00Z" }
   * // Returns: SessionSchema
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a session',
    description: 'Creates a new session with the given movie and room',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Session created successfully',
    type: SessionApiSchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Session cannot be created',
  })
  async create(
    @Body() createSessionDto: CreateSessionDto,
  ): Promise<SessionSchema> {
    return this.sessionsService.create(createSessionDto);
  }

  /**
   * Updates an existing session by its ID.
   *
   * @param {string} id - The UUID of the session to update
   * @param {UpdateSessionBodyDto} updateSessionBodyDto - DTO containing the fields to update
   * @returns {Promise<SessionSchema>} The updated session
   * @throws {BadRequestException} When the session cannot be updated (e.g., invalid data, scheduling conflict)
   * @throws {NotFoundException} When the session with the given ID is not found
   *
   * @example
   * // PUT /sessions/123e4567-e89b-12d3-a456-426614174000
   * // Body: { startTime: "2024-01-01T14:00:00Z" }
   * // Returns: SessionSchema
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a session',
    description: 'Updates a session by its ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Session updated successfully',
    type: SessionApiSchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Session cannot be updated',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSessionBodyDto: UpdateSessionBodyDto,
  ): Promise<SessionSchema> {
    return this.sessionsService.update({ id, ...updateSessionBodyDto });
  }
}
