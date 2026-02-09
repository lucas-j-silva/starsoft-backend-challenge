/**
 * @fileoverview Seats database schema definitions for room seating management.
 *
 * @description
 * This file contains Drizzle ORM schema definitions for the seats system.
 * Seats are associated with rooms and identified by row letter and column number.
 *
 * @module seats.schema
 */

import { UUIDGeneratorHelper } from 'src/shared/helpers';
import {
  uuid,
  pgTable,
  timestamp,
  varchar,
  integer,
} from 'drizzle-orm/pg-core';
import { roomsTable } from './rooms.schema';
import { unique } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';

/**
 * Seats table schema - stores individual seat information within rooms.
 *
 * @description
 * Defines the database structure for seats in a room.
 * Each seat is uniquely identified by its row (letter) and column (number) combination.
 *
 * @example
 * // A seat with row "A" and column 12 would be referred to as "A12"
 * // A seat with row "B" and column 5 would be referred to as "B5"
 */
export const seatsTable = pgTable(
  'seats',
  {
    /**
     * Unique identifier for the seat.
     * @type {string} UUID v4 format, auto-generated on insert.
     */
    id: uuid('id')
      .primaryKey()
      .$default(() => UUIDGeneratorHelper.generateUUID()),

    /**
     * Foreign key reference to the room this seat belongs to.
     * @type {string} UUID referencing the rooms table.
     */
    roomId: uuid('room_id')
      .notNull()
      .references(() => roomsTable.id),

    /**
     * Row identifier for the seat (typically a letter).
     * @type {string} Maximum 128 characters.
     * @example "A" - represents row A (e.g., A1, A2, A12)
     */
    row: varchar('row', { length: 128 }).notNull(), // EX: A = Axx

    /**
     * Column number for the seat within the row.
     * @type {number} Integer value representing the seat position in the row.
     * @example 12 - combined with row "A" gives seat "A12"
     */
    column: integer('column').notNull(), // EX: 12 = A12

    /**
     * Timestamp when the seat record was created.
     * @type {Date} Auto-set to current timestamp on insert.
     */
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },

  /**
   * Table constraints and indexes configuration.
   *
   * @description
   * Defines database-level constraints and indexes for the seats table:
   * - Unique constraint: Ensures no duplicate seats exist with the same roomId, row, and column combination.
   * - Composite index: Optimizes queries that filter or join on roomId, row, and column.
   */
  (table) => [
    /** Unique constraint preventing duplicate seat positions within the same room. */
    unique().on(table.roomId, table.row, table.column),
    /** Composite index for efficient lookups by room, row, and column. */
    index().on(table.roomId, table.row, table.column),
  ],
);

/**
 * Type representing a seat record as returned from database queries.
 */
export type SeatSchema = typeof seatsTable.$inferSelect;

/**
 * Type representing the data required to insert a new seat record.
 */
export type SeatInsertSchema = typeof seatsTable.$inferInsert;
