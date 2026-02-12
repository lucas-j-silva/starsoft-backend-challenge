/**
 * @fileoverview Schema definition for session seats.
 *
 * @description
 * This file contains the Drizzle ORM schema definition for the session seats
 * table. It defines the structure for tracking seat availability and sales
 * within specific sessions.
 *
 * @module session-seats.schema
 */

import { UUIDGeneratorHelper } from 'src/shared/helpers';
import {
  pgTable,
  uuid,
  timestamp,
  unique,
  boolean,
  text,
} from 'drizzle-orm/pg-core';
import { SeatSchema, seatsTable } from 'src/modules/rooms/schemas/seats.schema';
import { SessionSchema, sessionsTable } from '../../core/schemas';
import { user, UserSchema } from 'src/modules/auth/schemas/auth.schema';

/**
 * Database table schema for session seats.
 *
 * @description
 * Defines the structure of the `session_seats` table which stores the
 * relationship between sessions and seats, tracking availability and sale
 * timestamps. A unique constraint is applied on sessionId and seatId to
 * prevent duplicate seat assignments within a session.
 *
 * @example
 * // Inserting a session seat
 * await db.insert(sessionSeatsTable).values({
 *   sessionId: '550e8400-e29b-41d4-a716-446655440000',
 *   seatId: '660e8400-e29b-41d4-a716-446655440001',
 *   isAvailable: true
 * });
 */
export const sessionSeatsTable = pgTable(
  'session_seats',
  {
    /**
     * Unique identifier for the session seat.
     * @type {string} UUID auto-generated using UUIDGeneratorHelper.
     */
    id: uuid('id')
      .primaryKey()
      .$default(() => UUIDGeneratorHelper.generateUUID()),

    /**
     * Reference to the session this seat belongs to.
     * @type {string} UUID foreign key referencing the sessions table.
     */
    sessionId: uuid('session_id')
      .notNull()
      .references(() => sessionsTable.id),

    /**
     * Reference to the physical seat.
     * @type {string} UUID foreign key referencing the seats table.
     */
    seatId: uuid('seat_id')
      .notNull()
      .references(() => seatsTable.id),

    /**
     * Reference to the user who reserved the seat.
     * @type {string} Text foreign key referencing the user table.
     */
    userId: text('user_id').references(() => user.id),

    /**
     * Indicates whether the seat is available for reservation or purchase.
     * @type {boolean} Defaults to true.
     */
    isAvailable: boolean('is_available').notNull().default(true),

    /**
     * Timestamp when the seat was sold.
     * @type {Date | null} Timezone-aware timestamp, null if not yet sold.
     */
    soldAt: timestamp('sold_at', { withTimezone: true }),
  },
  (table) => [unique().on(table.sessionId, table.seatId)],
);

/**
 * Type representing a session seat record from the database.
 *
 * @description
 * Inferred select type from the sessionSeatsTable schema.
 * Used for type-safe retrieval of session seat records.
 */
export type SessionSeatSchema = typeof sessionSeatsTable.$inferSelect;

/**
 * Type representing a session seat record with its related seat and session.
 *
 * @description
 * Extends the base session seat schema by omitting the foreign key IDs
 * and adding optional nested relation objects for seat and session data.
 * Used when fetching session seats with joined relation data.
 */
export type SessionSeatSchemaWithRelations = Omit<
  typeof sessionSeatsTable.$inferSelect,
  'seatId' | 'sessionId'
> &
  Partial<{
    relations: Partial<{
      seat: SeatSchema | null;
      session: SessionSchema | null;
      user: UserSchema | null;
    }>;
  }>;

/**
 * Type representing the data required to insert a new session seat.
 *
 * @description
 * Inferred insert type from the sessionSeatsTable schema.
 * Used for type-safe insertion of new session seat records.
 */
export type SessionSeatInsertSchema = typeof sessionSeatsTable.$inferInsert;
