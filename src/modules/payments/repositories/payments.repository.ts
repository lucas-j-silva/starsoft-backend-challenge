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

@Injectable()
export class PaymentsRepository {
  constructor(
    private readonly txHost: TransactionHost<DatabaseTransactionAdapter>,
  ) {}

  async findById(id: string): Promise<PaymentSchema> {
    const [payment] = await this.txHost.tx
      .select()
      .from(paymentsTable)
      .where(eq(paymentsTable.id, id));

    if (!payment) throw new PaymentNotFoundException();

    return payment;
  }

  async findByIdAndUserId(id: string, userId: string): Promise<PaymentSchema> {
    const [payment] = await this.txHost.tx
      .select()
      .from(paymentsTable)
      .where(and(eq(paymentsTable.id, id), eq(paymentsTable.userId, userId)));

    if (!payment) throw new PaymentNotFoundException();

    return payment;
  }

  async findByIdOrExternalId(id: string): Promise<PaymentSchema> {
    const [payment] = await this.txHost.tx
      .select()
      .from(paymentsTable)
      .where(or(eq(paymentsTable.id, id), eq(paymentsTable.externalId, id)));

    if (!payment) throw new PaymentNotFoundException();

    return payment;
  }

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

  async insert(data: CreatePaymentDto): Promise<PaymentSchema> {
    const [payment] = await this.txHost.tx
      .insert(paymentsTable)
      .values(data)
      .returning();

    if (!payment) throw new UnableToCreatePaymentException();

    return payment;
  }

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
