/**
 * @fileoverview Drizzle ORM schema definition for the movies table.
 *
 * @description
 * This file contains the database schema definition for movies using Drizzle ORM,
 * including the table structure and TypeScript type exports for type-safe database operations.
 *
 * @module movies.schema
 */

import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { UUIDGeneratorHelper } from '../../../shared/helpers';

/**
 * Drizzle ORM table definition for the 'movies' table.
 *
 * @description
 * Defines the structure of the movies table in PostgreSQL with the following columns:
 * - id: UUID primary key, auto-generated using UUIDGeneratorHelper
 * - name: Movie title (max 128 characters)
 * - description: Movie description (max 255 characters)
 * - createdAt: Timestamp of record creation
 * - updatedAt: Timestamp of last update
 *
 * @example
 * ```typescript
 * // Insert a new movie
 * await db.insert(moviesTable).values({
 *   name: 'Inception',
 *   description: 'A mind-bending thriller about dreams within dreams'
 * });
 *
 * // Query all movies
 * const movies = await db.select().from(moviesTable);
 * ```
 */
export const moviesTable = pgTable('movies', {
  id: uuid('id')
    .primaryKey()
    .$default(() => UUIDGeneratorHelper.generateUUID()),
  name: varchar('name', { length: 128 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

/**
 * TypeScript type representing a movie record selected from the database.
 *
 * @description
 * Inferred type from the moviesTable schema for SELECT operations.
 * Contains all columns including id, name, description, createdAt, and updatedAt.
 */
export type MovieSchema = typeof moviesTable.$inferSelect;

/**
 * TypeScript type representing the data required to insert a new movie.
 *
 * @description
 * Inferred type from the moviesTable schema for INSERT operations.
 * The id, createdAt, and updatedAt fields are optional as they have default values.
 */
export type MovieInsertSchema = typeof moviesTable.$inferInsert;
