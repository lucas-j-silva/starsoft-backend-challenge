/**
 * @fileoverview Rooms database schema definitions for cinema room management.
 *
 * @description
 * This file contains Drizzle ORM schema definitions for the rooms system.
 * Rooms represent physical cinema rooms where movie sessions take place.
 *
 * @module rooms.schema
 */

import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { UUIDGeneratorHelper } from '../../../shared/helpers';

/**
 * Rooms table schema - stores cinema room information.
 *
 * @description
 * Defines the database structure for cinema rooms.
 * Each room has a unique identifier and a name for identification.
 *
 * @example
 * // A room might be named "Room 1", "IMAX Theater", "VIP Room", etc.
 */
export const roomsTable = pgTable('rooms', {
  /**
   * Unique identifier for the room.
   * @type {string} UUID v4 format, auto-generated on insert.
   */
  id: uuid('id')
    .primaryKey()
    .$default(() => UUIDGeneratorHelper.generateUUID()),

  /**
   * Display name for the room.
   * @type {string} Maximum 128 characters.
   * @example "Room 1", "IMAX Theater", "VIP Room"
   */
  name: varchar('name', { length: 128 }).notNull(),

  /**
   * Timestamp when the room record was created.
   * @type {Date} Auto-set to current timestamp on insert.
   */
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * Type representing a room record as returned from database queries.
 */
export type RoomSchema = typeof roomsTable.$inferSelect;

/**
 * Type representing the data required to insert a new room record.
 */
export type RoomInsertSchema = typeof roomsTable.$inferInsert;
