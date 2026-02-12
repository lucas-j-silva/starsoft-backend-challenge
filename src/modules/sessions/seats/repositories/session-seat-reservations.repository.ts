/**
 * @fileoverview Repository for managing session seat reservations.
 *
 * @description
 * This file contains the repository class responsible for database operations
 * related to session seat reservations. It provides methods for creating,
 * listing, and deleting reservation records.
 *
 * @module session-seat-reservations.repository
 */

import {
  SessionSeatReservationInsertSchema,
  SessionSeatReservationSchema,
  sessionSeatReservationsTable,
} from '../schemas';
import { Injectable } from '@nestjs/common';
import { UnableToCreateSessionSeatReservationException } from '../exceptions/unable-to-create-session-seat-reservation.exception';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DatabaseTransactionAdapter } from 'src/shared/database/database.provider';
import { eq, lt } from 'drizzle-orm';
import { SessionSeatReservationNotFoundException } from '../exceptions/session-seat-reservation-not-found.exception';

/**
 * Repository for session seat reservation database operations.
 *
 * @description
 * Provides data access methods for session seat reservations, including
 * creating new reservations, listing expired reservations, and deleting
 * reservations. All operations are performed within a transactional context.
 *
 * @class SessionSeatReservationsRepository
 *
 * @example
 * // Injecting and using the repository
 * constructor(private readonly reservationsRepo: SessionSeatReservationsRepository) {}
 *
 * // Creating a reservation
 * const reservation = await this.reservationsRepo.insert({
 *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440000',
 *   userId: '660e8400-e29b-41d4-a716-446655440001',
 *   expiresAt: new Date(Date.now() + 15 * 60 * 1000)
 * });
 */
@Injectable()
export class SessionSeatReservationsRepository {
  /**
   * Creates an instance of SessionSeatReservationsRepository.
   *
   * @param {TransactionHost<DatabaseTransactionAdapter>} txHost - The transaction host for database operations.
   */
  constructor(
    private readonly txHost: TransactionHost<DatabaseTransactionAdapter>,
  ) {}

  async findById(id: string): Promise<SessionSeatReservationSchema> {
    const [reservation] = await this.txHost.tx
      .select()
      .from(sessionSeatReservationsTable)
      .where(eq(sessionSeatReservationsTable.id, id));

    if (!reservation) throw new SessionSeatReservationNotFoundException();

    return reservation;
  }

  /**
   * Retrieves all expired session seat reservations.
   *
   * @description
   * Queries the database for all reservations where the expiration date
   * is earlier than the current date and time.
   *
   * @returns {Promise<SessionSeatReservationSchema[]>} A promise that resolves to an array of expired reservations.
   *
   * @example
   * const expiredReservations = await reservationsRepo.listExpiredSessionSeatReservations();
   * console.log(`Found ${expiredReservations.length} expired reservations`);
   */
  async listExpiredSessionSeatReservations(): Promise<
    SessionSeatReservationSchema[]
  > {
    const reservations = await this.txHost.tx
      .select()
      .from(sessionSeatReservationsTable)
      .where(lt(sessionSeatReservationsTable.expiresAt, new Date()));

    return reservations;
  }

  /**
   * Inserts a new session seat reservation into the database.
   *
   * @description
   * Creates a new reservation record with the provided data. If the insertion
   * fails to return a valid record, an exception is thrown.
   *
   * @param {SessionSeatReservationInsertSchema} data - The reservation data to insert.
   * @returns {Promise<SessionSeatReservationSchema>} A promise that resolves to the created reservation.
   * @throws {UnableToCreateSessionSeatReservationException} When the reservation cannot be created.
   *
   * @example
   * const reservation = await reservationsRepo.insert({
   *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440000',
   *   userId: '660e8400-e29b-41d4-a716-446655440001',
   *   expiresAt: new Date(Date.now() + 15 * 60 * 1000)
   * });
   */
  async insert(
    data: SessionSeatReservationInsertSchema,
  ): Promise<SessionSeatReservationSchema> {
    const [reservation] = await this.txHost.tx
      .insert(sessionSeatReservationsTable)
      .values(data)
      .returning();

    if (!reservation) throw new UnableToCreateSessionSeatReservationException();

    return reservation;
  }

  /**
   * Deletes a session seat reservation by its ID.
   *
   * @description
   * Removes the reservation record with the specified ID from the database.
   *
   * @param {string} id - The unique identifier of the reservation to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   *
   * @example
   * await reservationsRepo.delete('550e8400-e29b-41d4-a716-446655440000');
   */
  async delete(id: string): Promise<void> {
    await this.txHost.tx
      .delete(sessionSeatReservationsTable)
      .where(eq(sessionSeatReservationsTable.id, id));
  }
}
