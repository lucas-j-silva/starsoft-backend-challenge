/**
 * @fileoverview Schema definition for session seat reservations.
 *
 * @description
 * This file contains the Drizzle ORM schema definition for the session seat
 * reservations table. It defines the structure for tracking temporary seat
 * reservations before they are confirmed or expire.
 *
 * @module session-seat-reservations.schema
 */

import { uuid } from 'drizzle-orm/pg-core';
import { pgTable, text, index, timestamp } from 'drizzle-orm/pg-core';
import { UUIDGeneratorHelper } from 'src/shared/helpers';
import { sessionSeatsTable } from './session-seats.schema';
import { user } from 'src/modules/auth/schemas/auth.schema';

/**
 * Database table schema for session seat reservations.
 *
 * @description
 * Defines the structure of the `session_seat_reservations` table which stores
 * temporary reservations for session seats. Reservations have an expiration time
 * and can be confirmed before expiry. An index is created on sessionSeatId and
 * userId for optimized query performance.
 *
 * @example
 * // Inserting a reservation
 * await db.insert(sessionSeatReservationsTable).values({
 *   userId: 'user-123',
 *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440000',
 *   expiresAt: new Date(Date.now() + 15 * 60 * 1000)
 * });
 */
export const sessionSeatReservationsTable = pgTable(
  'session_seat_reservations',
  {
    /**
     * Unique identifier for the reservation.
     * @type {string} UUID auto-generated using UUIDGeneratorHelper.
     */
    id: uuid('id')
      .primaryKey()
      .$default(() => UUIDGeneratorHelper.generateUUID()),

    /**
     * Reference to the user who made the reservation.
     * @type {string} Foreign key referencing the user table.
     */
    userId: text('user_id')
      .notNull()
      .references(() => user.id),

    /**
     * Reference to the session seat being reserved.
     * @type {string} UUID foreign key referencing the session_seats table.
     */
    sessionSeatId: uuid('session_seat_id')
      .notNull()
      .references(() => sessionSeatsTable.id),

    /**
     * Timestamp when the reservation expires.
     * @type {Date} Timezone-aware timestamp indicating reservation expiry.
     */
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),

    /**
     * Timestamp when the reservation was confirmed.
     * @type {Date | null} Timezone-aware timestamp, null if not yet confirmed.
     */
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),

    /**
     * Timestamp when the reservation was created.
     * @type {Date} Defaults to the current timestamp.
     */
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index().on(table.sessionSeatId, table.userId)],
);

/**
 * Type representing a session seat reservation record from the database.
 *
 * @description
 * Inferred select type from the sessionSeatReservationsTable schema.
 * Used for type-safe retrieval of reservation records.
 */
export type SessionSeatReservationSchema =
  typeof sessionSeatReservationsTable.$inferSelect;

/**
 * Type representing the data required to insert a new session seat reservation.
 *
 * @description
 * Inferred insert type from the sessionSeatReservationsTable schema.
 * Used for type-safe insertion of new reservation records.
 */
export type SessionSeatReservationInsertSchema =
  typeof sessionSeatReservationsTable.$inferInsert;
