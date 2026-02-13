import { Injectable } from '@nestjs/common';
import { SeatInsertSchema, SeatSchema, seatsTable } from '../schemas';
import { UnableToCreateSeatException } from '../exceptions/unable-to-create-seat.exception';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { and, eq } from 'drizzle-orm';
import { SeatNotFoundException } from '../exceptions/seat-not-found.exception';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DatabaseTransactionAdapter } from '../../../shared/database/database.provider';

@Injectable()
export class SeatsRepository {
  constructor(
    private readonly txHost: TransactionHost<DatabaseTransactionAdapter>,
  ) {}

  async listWithPagination(
    roomId: string,
    pagination: PaginationDto,
  ): Promise<PaginationResultDto<SeatSchema>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const offset = (page - 1) * limit;

    const count = await this.txHost.tx.$count(seatsTable);
    const totalPages = Math.ceil(count / limit);

    const seats = await this.txHost.tx
      .select()
      .from(seatsTable)
      .limit(limit)
      .offset(offset)
      .where(eq(seatsTable.roomId, roomId));

    return new PaginationResultDto<SeatSchema>({
      data: seats,
      metadata: {
        currentPage: pagination.page,
        totalPages: totalPages,
        limit: limit,
      },
    });
  }

  async listAll(roomId: string): Promise<SeatSchema[]> {
    const seats = await this.txHost.tx
      .select()
      .from(seatsTable)
      .where(eq(seatsTable.roomId, roomId));

    return seats;
  }

  async insert(data: SeatInsertSchema): Promise<SeatSchema> {
    const [seat] = await this.txHost.tx
      .insert(seatsTable)
      .values(data)
      .returning();

    if (!seat) throw new UnableToCreateSeatException();

    return seat;
  }

  async findByRoomIdAndRowAndColumn(
    roomId: string,
    row: string,
    column: number,
  ): Promise<SeatSchema | null> {
    const [seat] = await this.txHost.tx
      .select()
      .from(seatsTable)
      .where(
        and(
          eq(seatsTable.roomId, roomId),
          eq(seatsTable.row, row),
          eq(seatsTable.column, column),
        ),
      )
      .limit(1);

    if (!seat) throw new SeatNotFoundException();

    return seat;
  }
}
