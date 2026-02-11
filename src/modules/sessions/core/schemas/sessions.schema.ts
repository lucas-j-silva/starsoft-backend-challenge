/**
 * @fileoverview Database schema definition for session entities.
 *
 * @description
 * This file contains the Drizzle ORM schema definition for the sessions table,
 * which represents movie screening sessions in cinema rooms.
 *
 * @module sessions.schema
 */

import { integer, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { UUIDGeneratorHelper } from 'src/shared/helpers';
import { moviesTable } from 'src/modules/movies/schemas/movies.schema';
import { roomsTable } from 'src/modules/rooms/schemas/rooms.schema';

/**
 * Database table schema for sessions.
 *
 * @description
 * Defines the structure of the 'sessions' table in the database.
 * Sessions represent scheduled movie screenings in specific rooms with pricing information.
 *
 * @property {string} id - Unique identifier for the session (UUID, auto-generated).
 * @property {string} movieId - Foreign key reference to the movies table.
 * @property {string} roomId - Foreign key reference to the rooms table.
 * @property {number} valuePerSeatInCents - Price per seat in cents.
 * @property {Date} startTime - Scheduled start time of the session (with timezone).
 * @property {Date} createdAt - Timestamp when the session was created.
 *
 * @example
 * // Inserting a new session
 * await db.insert(sessionsTable).values({
 *   movieId: '550e8400-e29b-41d4-a716-446655440000',
 *   roomId: '660e8400-e29b-41d4-a716-446655440001',
 *   valuePerSeatInCents: 2500,
 *   startTime: new Date('2024-01-15T19:00:00Z'),
 * });
 */
export const sessionsTable = pgTable('sessions', {
  /**
   * Unique identifier for the session.
   * @type {string} UUID auto-generated using UUIDGeneratorHelper.
   */
  id: uuid('id')
    .primaryKey()
    .$default(() => UUIDGeneratorHelper.generateUUID()),

  /**
   * Foreign key reference to the associated movie.
   * @type {string} UUID foreign key referencing the movies table.
   */
  movieId: uuid('movie_id')
    .notNull()
    .references(() => moviesTable.id),

  /**
   * Foreign key reference to the associated room.
   * @type {string} UUID foreign key referencing the rooms table.
   */
  roomId: uuid('room_id')
    .notNull()
    .references(() => roomsTable.id),

  /**
   * Price per seat in cents for the session.
   * @type {number}
   */
  valuePerSeatInCents: integer('value_per_seat_in_cents').notNull(),

  /**
   * Scheduled start time of the session.
   * @type {Date} Timezone-aware timestamp indicating session start time.
   */
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),

  /**
   * Timestamp when the session was created.
   * @type {Date} Defaults to the current timestamp.
   */
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Type representing a session record selected from the database.
 *
 * @description
 * Inferred type from the sessionsTable schema for SELECT operations.
 * Contains all fields with their resolved types.
 */
export type SessionSchema = typeof sessionsTable.$inferSelect;

/**
 * Type representing the data required to insert a new session.
 *
 * @description
 * Inferred type from the sessionsTable schema for INSERT operations.
 * Contains required fields and optional fields with defaults.
 */
export type SessionInsertSchema = typeof sessionsTable.$inferInsert;
