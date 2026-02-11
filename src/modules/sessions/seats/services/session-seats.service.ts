/**
 * @fileoverview Service for managing session seats operations.
 *
 * @description
 * This file contains the service class that provides a facade for session seat
 * operations including listing, reserving, and bulk creation of session seats.
 * It delegates to specialized use cases for each operation.
 *
 * @module session-seats.service
 */

import { Injectable } from '@nestjs/common';
import {
  SessionSeatReservationSchema,
  SessionSeatSchema,
  SessionSeatSchemaWithRelations,
} from '../schemas';
import { CreateManySessionSeatsDto, ReserveSessionSeatDto } from '../dtos';
import { ListSessionSeatsUseCase } from '../use-cases/list-session-seats.use-case';
import { ReserveSessionSeatUseCase } from '../use-cases/reserve-session-seat.use-case';
import { CreateManySessionSeatsUseCase } from '../use-cases/create-many-session-seats.use-case';

/**
 * Service for session seat management operations.
 *
 * @description
 * Provides methods for listing session seats, reserving seats, and creating
 * multiple session seats. Acts as a facade that delegates to specialized
 * use cases for each operation.
 *
 * @class SessionSeatsService
 *
 * @example
 * // Listing seats for a session
 * const seats = await sessionSeatsService.list('session-uuid');
 *
 * @example
 * // Reserving a seat
 * const reservation = await sessionSeatsService.reserve({
 *   sessionSeatId: 'seat-uuid',
 *   userId: 'user-uuid'
 * });
 *
 * @example
 * // Creating multiple session seats
 * const seats = await sessionSeatsService.createMany({
 *   sessionId: 'session-uuid',
 *   seatIds: ['seat-1', 'seat-2']
 * });
 */
@Injectable()
export class SessionSeatsService {
  /**
   * Creates an instance of SessionSeatsService.
   *
   * @param {ListSessionSeatsUseCase} listSessionSeatsUseCase - Use case for listing session seats.
   * @param {ReserveSessionSeatUseCase} reserveSessionSeatUseCase - Use case for reserving a session seat.
   * @param {CreateManySessionSeatsUseCase} createManySessionSeatsUseCase - Use case for bulk creating session seats.
   */
  constructor(
    private readonly listSessionSeatsUseCase: ListSessionSeatsUseCase,
    private readonly reserveSessionSeatUseCase: ReserveSessionSeatUseCase,
    private readonly createManySessionSeatsUseCase: CreateManySessionSeatsUseCase,
  ) {}

  /**
   * Lists all session seats for a given session.
   *
   * @description
   * Retrieves all session seats associated with the specified session ID,
   * including related seat and session data.
   *
   * @param {string} sessionId - The unique identifier of the session.
   * @returns {Promise<SessionSeatSchemaWithRelations[]>} A promise that resolves to an array of session seats with their relations.
   *
   * @example
   * const seats = await sessionSeatsService.list('550e8400-e29b-41d4-a716-446655440000');
   * // Returns: [{ id: '...', isAvailable: true, relations: { seat: {...}, session: {...} } }, ...]
   */
  async list(sessionId: string): Promise<SessionSeatSchemaWithRelations[]> {
    return this.listSessionSeatsUseCase.execute({ id: sessionId });
  }

  /**
   * Reserves a session seat for a user.
   *
   * @description
   * Creates a temporary reservation for a session seat. The reservation
   * will expire after a configured time if not confirmed.
   *
   * @param {ReserveSessionSeatDto} data - The reservation data containing session seat and user information.
   * @returns {Promise<SessionSeatReservationSchema>} A promise that resolves to the created reservation record.
   *
   * @example
   * const reservation = await sessionSeatsService.reserve({
   *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440000',
   *   userId: 'user-123'
   * });
   * // Returns: { id: '...', sessionSeatId: '...', userId: '...', expiresAt: Date, ... }
   */
  async reserve(
    data: ReserveSessionSeatDto,
  ): Promise<SessionSeatReservationSchema> {
    return this.reserveSessionSeatUseCase.execute(data);
  }

  /**
   * Creates multiple session seats in bulk.
   *
   * @description
   * Creates multiple session seat records for a session. Typically used
   * when initializing seats for a new session.
   *
   * @param {CreateManySessionSeatsDto} data - The data containing session ID and seat IDs to create.
   * @returns {Promise<SessionSeatSchema[]>} A promise that resolves to an array of created session seats.
   *
   * @example
   * const seats = await sessionSeatsService.createMany({
   *   sessionId: '550e8400-e29b-41d4-a716-446655440000',
   *   seatIds: ['seat-1', 'seat-2', 'seat-3']
   * });
   * // Returns: [{ id: '...', sessionId: '...', seatId: '...', isAvailable: true }, ...]
   */
  async createMany(
    data: CreateManySessionSeatsDto,
  ): Promise<SessionSeatSchema[]> {
    return this.createManySessionSeatsUseCase.execute(data);
  }
}
