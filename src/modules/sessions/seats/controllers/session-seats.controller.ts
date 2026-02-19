/**
 * @fileoverview Controller for managing session seats operations.
 *
 * @description
 * This file contains the controller responsible for handling HTTP requests
 * related to session seat operations. It provides endpoints for listing seats
 * and reserving seats for a specific session.
 *
 * @module session-seats.controller
 */

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { SessionSeatsService } from '../services';
import {
  SessionSeatReservationSchema,
  SessionSeatSchemaWithRelations,
} from '../schemas';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SessionSeatWithRelationsApiSchema } from '../swagger/schemas/session-seat.api-schema';
import { SessionSeatReservationApiSchema } from '../swagger/schemas/session-seat-reservation.api-schema';

/**
 * Controller responsible for handling session seats operations.
 *
 * @description
 * Provides endpoints for listing seats and reserving seats for a specific session.
 * All endpoints are scoped to a specific session via the sessionId path parameter.
 *
 * @class SessionSeatsController
 */
@Controller('sessions/:sessionId/seats')
export class SessionSeatsController {
  /**
   * Constructs a new SessionSeatsController.
   *
   * @param {SessionSeatsService} sessionSeatsService - The service handling session seat operations.
   */
  constructor(private readonly sessionSeatsService: SessionSeatsService) {}

  /**
   * Lists all seats for a specific session.
   *
   * @param {string} sessionId - The UUID of the session to list seats for.
   * @returns {Promise<SessionSeatSchemaWithRelations[]>} - Promise resolving with an array of seats (with relations) for the session.
   *
   * @throws {NotFoundException} If the session is not found.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List seats for a session',
    description: 'Lists all seats for a session',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Seats listed successfully',
    type: [SessionSeatWithRelationsApiSchema],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiParam({
    name: 'sessionId',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  async list(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ): Promise<SessionSeatSchemaWithRelations[]> {
    return this.sessionSeatsService.list({ id: sessionId });
  }

  /**
   * Lists all seats for the current authenticated user in a specific session.
   *
   * @param {string} sessionId - The UUID of the session to list seats for.
   * @param {UserSession} session - The authenticated user's session containing user information.
   * @returns {Promise<SessionSeatSchemaWithRelations[]>} - Promise resolving with an array of seats (with relations) belonging to the current user for the session.
   *
   * @throws {NotFoundException} If the session is not found.
   */
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List seats for the current user in a session',
    description: 'Lists all seats for the current user in a session',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Seats listed successfully',
    type: [SessionSeatWithRelationsApiSchema],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiParam({
    name: 'sessionId',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  async listForCurrentUser(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Session() session: UserSession,
  ): Promise<SessionSeatSchemaWithRelations[]> {
    return this.sessionSeatsService.list({
      id: sessionId,
      userId: session.user.id,
    });
  }

  /**
   * Reserves a seat for a specific session.
   *
   * @param {string} sessionId - The UUID of the session.
   * @param {string} sessionSeatId - The UUID of the seat to reserve.
   * @param {UserSession} session - The authenticated user's session.
   * @returns {Promise<SessionSeatReservationSchema>} - Promise resolving with the reservation info. Reservation is valid for 30 seconds.
   *
   * @throws {NotFoundException} If the session seat is not found.
   * @throws {BadRequestException} If the seat is not available.
   * @throws {ConflictException} If the session seat is already reserved.
   */
  @Post(':sessionSeatId/reserve')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reserve a seat for a session',
    description:
      'Reserves a seat for a session, returns the reservation valid for 30 seconds, if the payment is successful the reservation is confirmed, otherwise the seat is released',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Seat reserved successfully',
    type: SessionSeatReservationApiSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session seat not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Seat not available',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Session seat already reserved',
  })
  @ApiParam({
    name: 'sessionId',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiParam({
    name: 'sessionSeatId',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  async reserve(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Param('sessionSeatId', ParseUUIDPipe) sessionSeatId: string,
    @Session() session: UserSession,
  ): Promise<SessionSeatReservationSchema> {
    return this.sessionSeatsService.reserve({
      sessionSeatId: sessionSeatId,
      userId: session.user.id,
      sessionId: sessionId,
    });
  }
}
