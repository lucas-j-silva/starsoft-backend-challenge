/**
 * @fileoverview Repository for managing session entities in the database.
 *
 * @description
 * This file contains the SessionsRepository class which provides data access
 * methods for session entities, including CRUD operations and pagination.
 *
 * @module sessions.repository
 */

import { SessionInsertSchema, SessionSchema, sessionsTable } from '../schemas';
import { Injectable } from '@nestjs/common';
import {
  SessionNotFoundException,
  UnableToCreateSessionException,
} from '../exceptions';
import { eq } from 'drizzle-orm';
import { UnableToUpdateSessionException } from '../exceptions/unable-to-update-session.exception';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DatabaseTransactionAdapter } from '../../../../shared/database/database.provider';
import { PaginationDto } from '../../../../shared/dtos/pagination.dto';
import { PaginationResultDto } from '../../../../shared/dtos/pagination-result.dto';

/**
 * Repository class for managing session entities.
 *
 * @description
 * Provides data access methods for session entities including finding by ID,
 * listing with pagination, inserting new sessions, and updating existing sessions.
 * Uses transactional database operations through the TransactionHost.
 *
 * @class SessionsRepository
 *
 * @example
 * const session = await sessionsRepository.findById('550e8400-e29b-41d4-a716-446655440000');
 *
 * @example
 * const paginatedSessions = await sessionsRepository.listWithPagination({ page: 1, limit: 10 });
 */
@Injectable()
export class SessionsRepository {
  /**
   * Creates an instance of SessionsRepository.
   *
   * @param {TransactionHost<DatabaseTransactionAdapter>} txHost - The transaction host for database operations.
   */
  constructor(
    private readonly txHost: TransactionHost<DatabaseTransactionAdapter>,
  ) {}

  /**
   * Finds a session by its unique identifier.
   *
   * @param {string} id - The unique identifier of the session to find.
   * @returns {Promise<SessionSchema>} A promise that resolves to the found session.
   * @throws {SessionNotFoundException} When no session is found with the given ID.
   *
   * @example
   * const session = await sessionsRepository.findById('550e8400-e29b-41d4-a716-446655440000');
   * console.log(session.movieId);
   */
  async findById(id: string): Promise<SessionSchema> {
    const [session] = await this.txHost.tx
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.id, id));

    if (!session) throw new SessionNotFoundException();

    return session;
  }

  /**
   * Lists sessions with pagination support.
   *
   * @param {PaginationDto} pagination - The pagination parameters.
   * @param {number} [pagination.page=1] - The page number to retrieve.
   * @param {number} [pagination.limit=10] - The number of items per page.
   * @returns {Promise<PaginationResultDto<SessionSchema>>} A promise that resolves to a paginated result containing sessions.
   *
   * @example
   * const result = await sessionsRepository.listWithPagination({ page: 1, limit: 10 });
   * console.log(result.data); // Array of SessionSchema
   * console.log(result.metadata); // Pagination metadata
   */
  async listWithPagination(
    pagination: PaginationDto,
  ): Promise<PaginationResultDto<SessionSchema>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const offset = (page - 1) * limit;

    const count = await this.txHost.tx.$count(sessionsTable);
    const totalPages = Math.ceil(count / limit);

    const sessions = await this.txHost.tx
      .select()
      .from(sessionsTable)
      .limit(limit)
      .offset(offset)
      .then((results) => results);

    return new PaginationResultDto<SessionSchema>({
      data: sessions,
      metadata: {
        currentPage: pagination.page,
        totalPages: totalPages,
        limit: limit,
      },
    });
  }

  /**
   * Inserts a new session into the database.
   *
   * @param {SessionInsertSchema} data - The session data to insert.
   * @returns {Promise<SessionSchema>} A promise that resolves to the newly created session.
   * @throws {UnableToCreateSessionException} When the session creation fails.
   *
   * @example
   * const newSession = await sessionsRepository.insert({
   *   movieId: '550e8400-e29b-41d4-a716-446655440000',
   *   roomId: '660e8400-e29b-41d4-a716-446655440001',
   *   valuePerSeatInCents: 2500,
   *   startTime: new Date('2024-01-15T19:00:00Z'),
   * });
   */
  async insert(data: SessionInsertSchema): Promise<SessionSchema> {
    const [session] = await this.txHost.tx
      .insert(sessionsTable)
      .values(data)
      .returning();

    if (!session) throw new UnableToCreateSessionException();

    return session;
  }

  /**
   * Updates an existing session in the database.
   *
   * @param {string} id - The unique identifier of the session to update.
   * @param {Partial<SessionInsertSchema>} data - The partial session data to update.
   * @returns {Promise<SessionSchema>} A promise that resolves to the updated session.
   * @throws {UnableToUpdateSessionException} When the session update fails.
   *
   * @example
   * const updatedSession = await sessionsRepository.update(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   { valuePerSeatInCents: 3000 }
   * );
   */
  async update(
    id: string,
    data: Partial<SessionInsertSchema>,
  ): Promise<SessionSchema> {
    const [session] = await this.txHost.tx
      .update(sessionsTable)
      .set(data)
      .where(eq(sessionsTable.id, id))
      .returning();

    if (!session) throw new UnableToUpdateSessionException();

    return session;
  }
}
