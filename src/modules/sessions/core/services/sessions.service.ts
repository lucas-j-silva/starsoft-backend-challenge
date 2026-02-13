/**
 * @fileoverview Service layer for managing session operations.
 *
 * @description
 * This file contains the SessionsService class which acts as a facade
 * for session-related use cases, providing a unified interface for
 * creating, updating, and listing sessions.
 *
 * @module sessions.service
 */

import { Injectable } from '@nestjs/common';

import {
  CreateSessionDto,
  FindSessionDto,
  ListSessionsWithPaginationDto,
  UpdateSessionDto,
} from '../dtos';
import { SessionSchema } from '../schemas';
import { PaginationResultDto } from '../../../../shared/dtos/pagination-result.dto';
import { ListSessionsWithPaginationUseCase } from '../use-cases/list-sessions-with-pagination.use-case';
import { UpdateSessionUseCase } from '../use-cases/update-session.use-case';
import { CreateSessionUseCase } from '../use-cases/create-session.use-case';
import { GetSessionValuePerSeatUseCase } from '../use-cases/get-session-value-per-seat.use-case';
import { FindSessionUseCase } from '../use-cases/find-session.use-case';

/**
 * Service class for managing session operations.
 *
 * @description
 * Provides a unified interface for session-related operations by delegating
 * to specific use cases. This service acts as a facade layer between
 * controllers and use cases.
 *
 * @class SessionsService
 *
 * @example
 * const session = await sessionsService.create({
 *   movieId: '550e8400-e29b-41d4-a716-446655440000',
 *   roomId: '660e8400-e29b-41d4-a716-446655440001',
 *   valuePerSeatInCents: 2500,
 *   startTime: new Date('2024-01-15T19:00:00Z'),
 * });
 */
@Injectable()
export class SessionsService {
  /**
   * Creates an instance of SessionsService.
   *
   * @param {CreateSessionUseCase} createSessionUseCase - Use case for creating sessions.
   * @param {ListSessionsWithPaginationUseCase} listSessionsWithPaginationUseCase - Use case for listing sessions with pagination.
   * @param {UpdateSessionUseCase} updateSessionUseCase - Use case for updating sessions.
   * @param {GetSessionValuePerSeatUseCase} getSessionValuePerSeatUseCase - Use case for getting session value per seat.
   * @param {FindSessionUseCase} findSessionUseCase - Use case for finding sessions.
   */
  constructor(
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly listSessionsWithPaginationUseCase: ListSessionsWithPaginationUseCase,
    private readonly updateSessionUseCase: UpdateSessionUseCase,
    private readonly getSessionValuePerSeatUseCase: GetSessionValuePerSeatUseCase,
    private readonly findSessionUseCase: FindSessionUseCase,
  ) {}

  /**
   * Creates a new session.
   *
   * @param {CreateSessionDto} data - The data transfer object containing session creation details.
   * @returns {Promise<SessionSchema>} A promise that resolves to the newly created session.
   *
   * @example
   * const session = await sessionsService.create({
   *   movieId: '550e8400-e29b-41d4-a716-446655440000',
   *   roomId: '660e8400-e29b-41d4-a716-446655440001',
   *   valuePerSeatInCents: 2500,
   *   startTime: new Date('2024-01-15T19:00:00Z'),
   * });
   */
  async create(data: CreateSessionDto): Promise<SessionSchema> {
    return this.createSessionUseCase.execute(data);
  }

  /**
   * Updates an existing session.
   *
   * @param {UpdateSessionDto} data - The data transfer object containing session update details.
   * @returns {Promise<SessionSchema>} A promise that resolves to the updated session.
   *
   * @example
   * const session = await sessionsService.update({
   *   id: '550e8400-e29b-41d4-a716-446655440000',
   *   valuePerSeatInCents: 3000,
   *   startTime: new Date('2024-12-25T20:00:00Z'),
   * });
   */
  async update(data: UpdateSessionDto): Promise<SessionSchema> {
    return this.updateSessionUseCase.execute(data);
  }

  /**
   * Lists sessions with pagination support.
   *
   * @param {ListSessionsWithPaginationDto} data - The data transfer object containing pagination parameters.
   * @returns {Promise<PaginationResultDto<SessionSchema>>} A promise that resolves to a paginated result containing sessions.
   *
   * @example
   * const result = await sessionsService.listWithPagination({ page: 1, limit: 10 });
   * console.log(result.data); // Array of SessionSchema
   * console.log(result.metadata); // Pagination metadata
   */
  async listWithPagination(
    data: ListSessionsWithPaginationDto,
  ): Promise<PaginationResultDto<SessionSchema>> {
    return this.listSessionsWithPaginationUseCase.execute(data);
  }

  /**
   * Retrieves the value per seat for a specific session.
   *
   * @param {string} id - The unique identifier of the session.
   * @returns {Promise<number>} A promise that resolves to the value per seat in cents.
   *
   * @example
   * const valuePerSeat = await sessionsService.getSessionValuePerSeat('550e8400-e29b-41d4-a716-446655440000');
   * console.log(valuePerSeat); // 2500 (in cents)
   */
  async getSessionValuePerSeat(id: string): Promise<number> {
    return this.getSessionValuePerSeatUseCase.execute({ id });
  }

  /**
   * Finds a session by its identifier.
   *
   * @param {FindSessionDto} data - The data transfer object containing the session identifier.
   * @returns {Promise<SessionSchema>} A promise that resolves to the found session.
   *
   * @example
   * const session = await sessionsService.findSession({ id: '550e8400-e29b-41d4-a716-446655440000' });
   * console.log(session); // SessionSchema object
   */
  async findSession(data: FindSessionDto): Promise<SessionSchema> {
    return this.findSessionUseCase.execute(data);
  }
}
