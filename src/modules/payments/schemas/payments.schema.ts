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
import { user } from 'src/modules/auth/schemas/auth.schema';
import { UUIDGeneratorHelper } from 'src/shared/helpers';
import { PaymentStatus } from '../enums/payment-status.enum';

export const paymentStatus = pgEnum('payment_status', PaymentStatus);

export const paymentsTable = pgTable(
  'payments',
  {
    id: uuid('id')
      .primaryKey()
      .$default(() => UUIDGeneratorHelper.generateUUID()),

    userId: text('user_id')
      .notNull()
      .references(() => user.id)
      .notNull(),

    amountInCents: integer('amount_in_cents').notNull(),
    status: paymentStatus('status').default(PaymentStatus.PENDING).notNull(),

    approvedAt: timestamp('approved_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    externalId: text('external_id'),
  },
  (table) => [
    unique().on(table.externalId),
    index().on(table.externalId, table.userId),
    index().on(table.status, table.expiresAt),
  ],
);

export type PaymentSchema = typeof paymentsTable.$inferSelect;
export type PaymentInsertSchema = typeof paymentsTable.$inferInsert;
