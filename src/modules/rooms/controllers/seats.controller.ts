/**
 * @fileoverview Controller for managing seats within rooms.
 *
 * @description
 * This file contains the controller responsible for handling HTTP requests
 * related to seat operations within a specific room. It provides endpoints
 * for listing seats with pagination and creating new seats.
 *
 * @module seats.controller
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
import { SeatsService } from '../services/seats.service';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { SeatSchema } from '../schemas';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SeatApiSchema } from '../swagger/schemas';
import { SeatsPaginationResultApiSchema } from '../swagger/schemas/seats-pagination-result.api-schema';
import { CreateSeatBodyDto, ListSeatsWithPaginationQueryDto } from '../dtos';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

/**
 * Controller for seat-related operations within a room.
 *
 * @description
 * Handles HTTP requests for seat management, including listing seats
 * with pagination and creating new seats. All endpoints are scoped
 * to a specific room via the roomId path parameter.
 *
 * @class SeatsController
 */
@Controller('rooms/:roomId/seats')
export class SeatsController {
  /**
   * Creates an instance of SeatsController.
   *
   * @param {SeatsService} seatsService - The service for seat operations.
   */
  constructor(private readonly seatsService: SeatsService) {}

  /**
   * Lists all seats in a room with pagination.
   *
   * @description
   * Retrieves a paginated list of seats for the specified room.
   *
   * @param {string} roomId - The UUID of the room to list seats from.
   * @param {ListSeatsWithPaginationQueryDto} query - Pagination query parameters.
   * @returns {Promise<PaginationResultDto<SeatSchema>>} A paginated result containing seats.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List seats with pagination',
    description: 'Retrieves a paginated list of seats for the specified room',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The seats have been successfully retrieved.',
    type: SeatsPaginationResultApiSchema,
  })
  @ApiParam({
    name: 'roomId',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @AllowAnonymous()
  async listWithPagination(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Query() query: ListSeatsWithPaginationQueryDto,
  ): Promise<PaginationResultDto<SeatSchema>> {
    return this.seatsService.listWithPagination({
      roomId,
      page: query.page,
      limit: query.limit,
    });
  }

  /**
   * Creates a new seat in a room.
   *
   * @description
   * Creates a new seat with the specified row and column in the given room.
   *
   * @param {string} roomId - The UUID of the room where the seat will be created.
   * @param {CreateSeatBodyDto} body - The seat creation data containing row and column.
   * @returns {Promise<SeatSchema>} The newly created seat.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new seat',
    description:
      'Creates a new seat with the specified row and column in the given room',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The seat has been successfully created.',
    type: SeatApiSchema,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The seat cannot be created.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The seat already exists.',
  })
  @ApiParam({
    name: 'roomId',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  async create(
    @Param('roomId', ParseUUIDPipe) roomId: string,
    @Body() body: CreateSeatBodyDto,
  ): Promise<SeatSchema> {
    return this.seatsService.create({
      roomId,
      column: body.column,
      row: body.row,
    });
  }
}
