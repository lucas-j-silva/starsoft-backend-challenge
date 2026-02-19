/**
 * @fileoverview Repository for managing payment entities in the database.
 *
 * @description
 * This file contains the PaymentsRepository class which provides data access
 * methods for payment entities, including lookups by ID, user-scoped queries,
 * listing expired payments, paginated listing with filter, insertion, and updates.
 *
 * @module payments.repository
 */

import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { DatabaseTransactionAdapter } from '../../../shared/database/database.provider';
import {
  CreatePaymentDto,
  ListPaymentsWithPaginationAndFilterDto,
} from '../dtos';
import { PaymentInsertSchema, PaymentSchema, paymentsTable } from '../schemas';
import { UnableToCreatePaymentException } from '../exceptions/unable-to-create-payment.exception';
import { and, desc, eq, lt, or, SQL } from 'drizzle-orm';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { PaymentNotFoundException } from '../exceptions';

/**
 * Repository class for managing payment entities.
 *
 * @description
 * Provides data access methods for payment entities including finding by ID,
 * finding by ID with user ownership check, finding by ID or external ID,
 * listing expired payments, listing with pagination and filter, inserting new
 * payments, and updating existing payments. Uses transactional database
 * operations through the TransactionHost.
 *
 * @class PaymentsRepository
 *
 * @example
 * const payment = await paymentsRepository.findById('550e8400-e29b-41d4-a716-446655440000');
 *
 * @example
 * const paginatedPayments = await paymentsRepository.listWithPaginationAndFilter({
 *   page: 1,
 *   limit: 10,
 *   userId: 'user-uuid'
 * });
 */
@Injectable()
export class PaymentsRepository {
  /**
   * Creates an instance of PaymentsRepository.
   *
   * @param {TransactionHost<DatabaseTransactionAdapter>} txHost - The transaction host for database operations.
   */
  constructor(
    private readonly txHost: TransactionHost<DatabaseTransactionAdapter>,
  ) {}

  /**
   * Finds a payment by its unique primary key identifier.
   *
   * @async
   * @param {string} id - The unique identifier of the payment to find.
   * @returns {Promise<PaymentSchema>} A promise that resolves to the found payment.
   * @throws {PaymentNotFoundException} When no payment is found with the given ID.
   *
   * @example
   * const payment = await paymentsRepository.findById('550e8400-e29b-41d4-a716-446655440000');
   * console.log(payment.status);
   */
  async findById(id: string): Promise<PaymentSchema> {
    const [payment] = await this.txHost.tx
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.id, id));

    if (!payment) throw new PaymentNotFoundException();

    return payment;
  }

  /**
   * Finds a payment by its ID ensuring it belongs to the specified user.
   *
   * @async
   * @param {string} id - The unique identifier of the payment.
   * @param {string} userId - The unique identifier of the user who must own the payment.
   * @returns {Promise<PaymentSchema>} A promise that resolves to the found payment.
   * @throws {PaymentNotFoundException} When no payment is found with the given ID for the specified user.
   *
   * @example
   * const payment = await paymentsRepository.findByIdAndUserId(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   'user-uuid'
   * );
   * console.log(payment.userId);
   */
  async findByIdAndUserId(id: string, userId: string): Promise<PaymentSchema> {
    const [payment] = await this.txHost.tx
      .select()
      .from(paymentsTable)
      .where(and(eq(paymentsTable.id, id), eq(paymentsTable.userId, userId)));

    if (!payment) throw new PaymentNotFoundException();

    return payment;
  }

  /**
   * Finds a payment by searching both its internal ID and its external identifier.
   *
   * @async
   * @param {string} id - The value to match against both the internal ID and the externalId columns.
   * @returns {Promise<PaymentSchema>} A promise that resolves to the found payment.
   * @throws {PaymentNotFoundException} When no payment is found matching either the ID or external ID.
   *
   * @example
   * const payment = await paymentsRepository.findByIdOrExternalId('ext-ref-abc123');
   * console.log(payment.externalId);
   */
  async findByIdOrExternalId(id: string): Promise<PaymentSchema> {
    const [payment] = await this.txHost.tx
      .select()
      .from(paymentsTable)
      .where(or(eq(paymentsTable.id, id), eq(paymentsTable.externalId, id)));

    if (!payment) throw new PaymentNotFoundException();

    return payment;
  }

  /**
   * Returns all payments that are in PENDING status and have passed their expiration date.
   *
   * @async
   * @returns {Promise<PaymentSchema[]>} A promise that resolves to an array of expired pending payments.
   *
   * @example
   * const expiredPayments = await paymentsRepository.listExpiredPayments();
   * // Returns: [{ id: '...', status: 'PENDING', expiresAt: Date(past), ... }, ...]
   */
  async listExpiredPayments(): Promise<PaymentSchema[]> {
    const payments = await this.txHost.tx
      .select()
      .from(paymentsTable)
      .where(
        and(
          lt(paymentsTable.expiresAt, new Date()),
          eq(paymentsTable.status, PaymentStatus.PENDING),
        ),
      );

    return payments;
  }

  /**
   * Lists payments for a user with pagination support and an optional status filter.
   *
   * @async
   * @param {ListPaymentsWithPaginationAndFilterDto} data - The query parameters including page, limit, userId, and optional status.
   * @param {number} [data.page=1] - The page number to retrieve.
   * @param {number} [data.limit=10] - The number of items per page.
   * @param {string} data.userId - The user ID to scope the payment list to.
   * @param {PaymentStatus} [data.status] - Optional payment status to filter by.
   * @returns {Promise<PaginationResultDto<PaymentSchema>>} A promise that resolves to a paginated and filtered list of payments.
   *
   * @example
   * const result = await paymentsRepository.listWithPaginationAndFilter({
   *   page: 1,
   *   limit: 10,
   *   userId: 'user-uuid',
   *   status: 'APPROVED'
   * });
   * console.log(result.data);     // Array of PaymentSchema
   * console.log(result.metadata); // Pagination metadata
   */
  async listWithPaginationAndFilter(
    data: ListPaymentsWithPaginationAndFilterDto,
  ): Promise<PaginationResultDto<PaymentSchema>> {
    const page = data.page ?? 1;
    const limit = data.limit ?? 10;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [eq(paymentsTable.userId, data.userId)];

    if (data.status) {
      conditions.push(eq(paymentsTable.status, data.status));
    }

    const whereClause = and(...conditions);

    const count = await this.txHost.tx.$count(paymentsTable, whereClause);
    const totalPages = Math.ceil(count / limit);

    const payments = await this.txHost.tx
      .select()
      .from(paymentsTable)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(paymentsTable.createdAt));

    return new PaginationResultDto<PaymentSchema>({
      data: payments,
      metadata: {
        currentPage: data.page,
        totalPages: totalPages,
        limit: limit,
      },
    });
  }

  /**
   * Inserts a new payment record into the database.
   *
   * @async
   * @param {CreatePaymentDto} data - The payment data to insert.
   * @returns {Promise<PaymentSchema>} A promise that resolves to the newly created payment.
   * @throws {UnableToCreatePaymentException} When the payment creation fails.
   *
   * @example
   * const newPayment = await paymentsRepository.insert({
   *   userId: 'user-uuid',
   *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440000',
   *   amountInCents: 2500,
   *   expiresAt: new Date('2024-01-15T20:00:00Z'),
   * });
   */
  async insert(data: CreatePaymentDto): Promise<PaymentSchema> {
    const [payment] = await this.txHost.tx
      .insert(paymentsTable)
      .values(data)
      .returning();

    if (!payment) throw new UnableToCreatePaymentException();

    return payment;
  }

  /**
   * Updates an existing payment record in the database by its ID.
   *
   * @async
   * @param {string} id - The unique identifier of the payment to update.
   * @param {Partial<PaymentInsertSchema>} data - The partial payment data fields to update.
   * @returns {Promise<PaymentSchema>} A promise that resolves to the updated payment.
   *
   * @example
   * const updatedPayment = await paymentsRepository.update(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   { status: 'APPROVED', approvedAt: new Date() }
   * );
   */
  async update(
    id: string,
    data: Partial<PaymentInsertSchema>,
  ): Promise<PaymentSchema> {
    const [payment] = await this.txHost.tx
      .update(paymentsTable)
      .set(data)
      .where(eq(paymentsTable.id, id))
      .returning();

    return payment;
  }
}
