/**
 * @fileoverview Repository for managing session seats.
 *
 * @description
 * This file contains the repository class responsible for database operations
 * related to session seats. It provides methods for finding, listing, and
 * creating session seat records.
 *
 * @module session-seats.repository
 */

import {
  SessionSeatInsertSchema,
  SessionSeatSchema,
  SessionSeatSchemaWithRelations,
  sessionSeatsTable,
} from '../schemas/session-seats.schema';
import {
  UnableToCreateBulkSessionSeatsException,
  UnableToCreateSessionSeatException,
  SessionSeatNotFoundException,
} from '../exceptions';
import { Injectable } from '@nestjs/common';
import { and, asc, eq, getTableColumns } from 'drizzle-orm';
import { seatsTable } from '../../../rooms/schemas';
import { sessionsTable } from '../../core/schemas';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DatabaseTransactionAdapter } from '../../../../shared/database/database.provider';
import { UnableToUpdateSessionSeatException } from '../exceptions/unable-to-update-session-seat.exception';

/**
 * Repository for session seat database operations.
 *
 * @description
 * Provides data access methods for session seats, including finding by ID,
 * listing all seats for a session, and creating new session seats.
 * All operations are performed within a transactional context.
 *
 * @class SessionSeatsRepository
 *
 * @example
 * // Injecting and using the repository
 * constructor(private readonly sessionSeatsRepo: SessionSeatsRepository) {}
 *
 * // Finding a session seat by ID
 * const sessionSeat = await this.sessionSeatsRepo.findById('550e8400-e29b-41d4-a716-446655440000');
 */
@Injectable()
export class SessionSeatsRepository {
  /**
   * Creates an instance of SessionSeatsRepository.
   *
   * @param {TransactionHost<DatabaseTransactionAdapter>} txHost - The transaction host for database operations.
   */
  constructor(
    private readonly txHost: TransactionHost<DatabaseTransactionAdapter>,
  ) {}

  /**
   * Finds a session seat by its unique identifier.
   *
   * @description
   * Queries the database for a session seat with the specified ID.
   * Throws an exception if the session seat is not found.
   *
   * @param {string} id - The unique identifier of the session seat.
   * @returns {Promise<SessionSeatSchema>} A promise that resolves to the found session seat.
   * @throws {SessionSeatNotFoundException} When no session seat is found with the given ID.
   *
   * @example
   * const sessionSeat = await sessionSeatsRepo.findById('550e8400-e29b-41d4-a716-446655440000');
   * console.log(sessionSeat.isAvailable); // true or false
   */
  async findById(id: string): Promise<SessionSeatSchema> {
    const [sessionSeat] = await this.txHost.tx
      .select()
      .from(sessionSeatsTable)
      .where(eq(sessionSeatsTable.id, id));

    if (!sessionSeat) throw new SessionSeatNotFoundException();

    return sessionSeat;
  }

  /**
   * Finds a session seat by its unique identifier with related session data.
   *
   * @description
   * Queries the database for a session seat with the specified ID and includes
   * the related session information. Throws an exception if the session seat is not found.
   *
   * @param {string} id - The unique identifier of the session seat.
   * @returns {Promise<SessionSeatSchemaWithRelations>} A promise that resolves to the session seat with relations.
   * @throws {SessionSeatNotFoundException} When no session seat is found with the given ID.
   *
   * @example
   * const sessionSeat = await sessionSeatsRepo.findByIdWithRelations('550e8400-e29b-41d4-a716-446655440000');
   * console.log(sessionSeat.relations.session?.movieId); // Movie ID of the session
   */
  async findByIdWithRelations(
    id: string,
  ): Promise<SessionSeatSchemaWithRelations> {
    const [sessionSeat] = await this.txHost.tx
      .select()
      .from(sessionSeatsTable)
      .where(eq(sessionSeatsTable.id, id))
      .leftJoin(
        sessionsTable,
        eq(sessionSeatsTable.sessionId, sessionsTable.id),
      );

    if (!sessionSeat) throw new SessionSeatNotFoundException();

    return {
      id: sessionSeat.session_seats.id,
      userId: sessionSeat.session_seats.userId,
      isAvailable: sessionSeat.session_seats.isAvailable,
      soldAt: sessionSeat.session_seats.soldAt,
      relations: {
        session: sessionSeat.sessions
          ? {
              id: sessionSeat.sessions.id,
              movieId: sessionSeat.sessions.movieId,
              roomId: sessionSeat.sessions.roomId,
              valuePerSeatInCents: sessionSeat.sessions.valuePerSeatInCents,
              startTime: sessionSeat.sessions.startTime,
              createdAt: sessionSeat.sessions.createdAt,
            }
          : null,
      },
    };
  }

  /**
   * Lists all session seats for a specific session.
   *
   * @description
   * Retrieves all session seats associated with the given session ID,
   * including related seat information. Results are ordered by seat row and column.
   *
   * @param {string} sessionId - The unique identifier of the session.
   * @returns {Promise<SessionSeatSchemaWithRelations[]>} A promise that resolves to an array of session seats with relations.
   *
   * @example
   * const seats = await sessionSeatsRepo.listAll('550e8400-e29b-41d4-a716-446655440000');
   * console.log(`Found ${seats.length} seats for the session`);
   */
  async listAll(sessionId: string): Promise<SessionSeatSchemaWithRelations[]> {
    const sessionSeats = await this.txHost.tx
      .select({
        id: sessionSeatsTable.id,
        userId: sessionSeatsTable.userId,
        isAvailable: sessionSeatsTable.isAvailable,
        soldAt: sessionSeatsTable.soldAt,
        seat: getTableColumns(seatsTable),
      })
      .from(sessionSeatsTable)
      .where(eq(sessionSeatsTable.sessionId, sessionId))
      .leftJoin(seatsTable, eq(sessionSeatsTable.seatId, seatsTable.id))
      .orderBy(asc(seatsTable.row), asc(seatsTable.column));

    return sessionSeats.map((sessionSeat) => ({
      id: sessionSeat.id,
      userId: sessionSeat.userId,
      isAvailable: sessionSeat.isAvailable,
      soldAt: sessionSeat.soldAt,
      relations: {
        seat: sessionSeat.seat,
      },
    }));
  }

  /**
   * Lists all session seats for a specific session by user ID.
   *
   * @description
   * Retrieves all session seats associated with the given session ID and user ID,
   * including related seat information. Results are ordered by seat row and column.
   *
   * @param {string} sessionId - The unique identifier of the session.
   * @param {string} userId - The unique identifier of the user.
   * @returns {Promise<SessionSeatSchemaWithRelations[]>} A promise that resolves to an array of session seats with relations.
   *
   * @example
   * const seats = await sessionSeatsRepo.listAllByUserId('550e8400-e29b-41d4-a716-446655440000', 'user-123');
   * console.log(`Found ${seats.length} seats for the user in the session`);
   */
  async listAllByUserId(
    sessionId: string,
    userId: string,
  ): Promise<SessionSeatSchemaWithRelations[]> {
    const sessionSeats = await this.txHost.tx
      .select({
        id: sessionSeatsTable.id,
        userId: sessionSeatsTable.userId,
        isAvailable: sessionSeatsTable.isAvailable,
        soldAt: sessionSeatsTable.soldAt,
        seat: getTableColumns(seatsTable),
      })
      .from(sessionSeatsTable)
      .where(
        and(
          eq(sessionSeatsTable.userId, userId),
          eq(sessionSeatsTable.sessionId, sessionId),
        ),
      )
      .leftJoin(seatsTable, eq(sessionSeatsTable.seatId, seatsTable.id))
      .orderBy(asc(seatsTable.row), asc(seatsTable.column));

    return sessionSeats.map((sessionSeat) => ({
      id: sessionSeat.id,
      userId: sessionSeat.userId,
      isAvailable: sessionSeat.isAvailable,
      soldAt: sessionSeat.soldAt,
      relations: {
        seat: sessionSeat.seat,
      },
    }));
  }

  /**
   * Inserts multiple session seats into the database in bulk.
   *
   * @description
   * Creates multiple session seat records with the provided data array.
   * If the bulk insertion fails, an exception is thrown.
   *
   * @param {SessionSeatInsertSchema[]} data - An array of session seat data to insert.
   * @returns {Promise<SessionSeatSchema[]>} A promise that resolves to an array of created session seats.
   * @throws {UnableToCreateBulkSessionSeatsException} When the bulk insertion fails.
   *
   * @example
   * const sessionSeats = await sessionSeatsRepo.bulkInsert([
   *   { sessionId: '550e8400-e29b-41d4-a716-446655440000', seatId: '660e8400-e29b-41d4-a716-446655440001', isAvailable: true },
   *   { sessionId: '550e8400-e29b-41d4-a716-446655440000', seatId: '660e8400-e29b-41d4-a716-446655440002', isAvailable: true }
   * ]);
   */
  async bulkInsert(
    data: SessionSeatInsertSchema[],
  ): Promise<SessionSeatSchema[]> {
    const sessionSeats = await this.txHost.tx
      .insert(sessionSeatsTable)
      .values(data)
      .returning()
      .catch(() => null);

    if (sessionSeats === null)
      throw new UnableToCreateBulkSessionSeatsException();

    return sessionSeats;
  }

  /**
   * Inserts a new session seat into the database.
   *
   * @description
   * Creates a new session seat record with the provided data.
   * If the insertion fails to return a valid record, an exception is thrown.
   *
   * @param {SessionSeatInsertSchema} data - The session seat data to insert.
   * @returns {Promise<SessionSeatSchema>} A promise that resolves to the created session seat.
   * @throws {UnableToCreateSessionSeatException} When the session seat cannot be created.
   *
   * @example
   * const sessionSeat = await sessionSeatsRepo.insert({
   *   sessionId: '550e8400-e29b-41d4-a716-446655440000',
   *   seatId: '660e8400-e29b-41d4-a716-446655440001',
   *   isAvailable: true
   * });
   */
  async insert(data: SessionSeatInsertSchema): Promise<SessionSeatSchema> {
    const [sessionSeat] = await this.txHost.tx
      .insert(sessionSeatsTable)
      .values(data)
      .returning();

    if (!sessionSeat) throw new UnableToCreateSessionSeatException();

    return sessionSeat;
  }

  async update(
    id: string,
    data: Partial<SessionSeatInsertSchema>,
  ): Promise<SessionSeatSchema> {
    const [sessionSeat] = await this.txHost.tx
      .update(sessionSeatsTable)
      .set(data)
      .where(eq(sessionSeatsTable.id, id))
      .returning();

    if (!sessionSeat) throw new UnableToUpdateSessionSeatException();

    return sessionSeat;
  }
}
