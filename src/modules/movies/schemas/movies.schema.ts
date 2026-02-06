import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { UUIDGeneratorHelper } from 'src/shared/helpers';

export const moviesTable = pgTable('movies', {
  id: uuid('id')
    .primaryKey()
    .$default(() => UUIDGeneratorHelper.generateUUID()),
  name: varchar('name', { length: 128 }).notNull(),
  description: varchar('description', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type MovieSchema = typeof moviesTable.$inferSelect;
export type MovieInsertSchema = typeof moviesTable.$inferInsert;
