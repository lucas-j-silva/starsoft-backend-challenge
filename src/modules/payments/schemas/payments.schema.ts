/**
 * @fileoverview Database schema definition for payment entities.
 *
 * @description
 * This file contains the Drizzle ORM schema definition for the payments table,
 * the PostgreSQL enum for payment status values, and the inferred TypeScript types
 * used for SELECT and INSERT operations across the payments module.
 *
 * @module payments.schema
 */

import {
  pgTable,
  timestamp,
  uuid,
  integer,
  pgEnum,
  text,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import { user } from '../../auth/schemas/auth.schema';
import { UUIDGeneratorHelper } from '../../../shared/helpers';
import { PaymentStatus } from '../enums/payment-status.enum';

/**
 * PostgreSQL enum type for payment status values.
 *
 * @description
 * Maps the PaymentStatus TypeScript enum to a native PostgreSQL enum column type.
 * Used as the column type for the status field in paymentsTable.
 *
 * @example
 * // Used internally by Drizzle when defining the status column
 * status: paymentStatus('status').default(PaymentStatus.PENDING).notNull()
 */
export const paymentStatus = pgEnum('payment_status', PaymentStatus);

/**
 * Database table schema for payments.
 *
 * @description
 * Defines the structure of the 'payments' table in the database.
 * Payments represent financial transactions initiated by users, tracked through
 * their lifecycle from PENDING to APPROVED or EXPIRED.
 *
 * @example
 * // Inserting a new payment record
 * await db.insert(paymentsTable).values({
 *   userId: '550e8400-e29b-41d4-a716-446655440000',
 *   amountInCents: 2500,
 *   expiresAt: new Date('2024-12-31T23:59:59Z'),
 *   externalId: 'ext-ref-abc123',
 * });
 */
export const paymentsTable = pgTable(
  'payments',
  {
    /**
     * Unique identifier for the payment.
     * @type {string} UUID auto-generated using UUIDGeneratorHelper.
     */
    id: uuid('id')
      .primaryKey()
      .$default(() => UUIDGeneratorHelper.generateUUID()),

    /**
     * Foreign key reference to the user who owns this payment.
     * @type {string} Text foreign key referencing the user table's id column.
     */
    userId: text('user_id')
      .notNull()
      .references(() => user.id)
      .notNull(),

    /**
     * Payment amount expressed in cents (smallest currency unit).
     * @type {number} Integer representing the amount, e.g. 2500 = $25.00.
     */
    amountInCents: integer('amount_in_cents').notNull(),

    /**
     * Current lifecycle status of the payment.
     * @type {PaymentStatus} Defaults to PENDING when a payment is first created.
     */
    status: paymentStatus('status').default(PaymentStatus.PENDING).notNull(),

    /**
     * Timestamp when the payment was approved.
     * @type {Date | null} Null until the payment transitions to APPROVED status.
     */
    approvedAt: timestamp('approved_at', { withTimezone: true }),

    /**
     * Timestamp when the payment window expires.
     * @type {Date | null} Optional expiration time; null means no expiration.
     */
    expiresAt: timestamp('expires_at', { withTimezone: true }),

    /**
     * Timestamp when the payment record was created.
     * @type {Date} Defaults to the current timestamp at insertion time.
     */
    createdAt: timestamp('created_at').defaultNow().notNull(),

    /**
     * Timestamp when the payment record was last updated.
     * @type {Date} Defaults to current timestamp and automatically updated on any change.
     */
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    /**
     * Optional external system reference identifier for cross-referencing.
     * @type {string | null} Unique across the table when provided; null when not set.
     */
    externalId: text('external_id'),
  },
  (table) => [
    unique().on(table.externalId),
    index().on(table.externalId, table.userId),
    index().on(table.status, table.expiresAt),
  ],
);

/**
 * Type representing a payment record selected from the database.
 *
 * @description
 * Inferred type from the paymentsTable schema for SELECT operations.
 * Contains all fields with their resolved TypeScript types.
 */
export type PaymentSchema = typeof paymentsTable.$inferSelect;

/**
 * Type representing the data required to insert a new payment.
 *
 * @description
 * Inferred type from the paymentsTable schema for INSERT operations.
 * Contains required fields and optional fields that have database defaults.
 */
export type PaymentInsertSchema = typeof paymentsTable.$inferInsert;
