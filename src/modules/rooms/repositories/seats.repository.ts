import { DrizzleClientService } from 'src/shared/database/drizzle-client.service';
import { Injectable } from '@nestjs/common';
import { SeatInsertSchema, SeatSchema, seatsTable } from '../schemas';
import { UnableToCreateSeatException } from '../exceptions/unable-to-create-seat.exception';
import { PaginationResultDto } from 'src/shared/dtos/pagination-result.dto';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class SeatsRepository {
  constructor(private readonly drizzleClient: DrizzleClientService) {}

  async listWithPagination(
    roomId: string,
    pagination: PaginationDto,
  ): Promise<PaginationResultDto<SeatSchema>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const offset = (page - 1) * limit;

    const count = await this.drizzleClient.getInstance().$count(seatsTable);
    const totalPages = Math.ceil(count / limit);

    const seats = await this.drizzleClient
      .getInstance()
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
    const seats = await this.drizzleClient
      .getInstance()
      .select()
      .from(seatsTable)
      .where(eq(seatsTable.roomId, roomId));

    return seats;
  }

  async insert(data: SeatInsertSchema): Promise<SeatSchema> {
    const seat = await this.drizzleClient
      .getInstance()
      .insert(seatsTable)
      .values(data)
      .returning()
      .then((results) => results[0]);

    if (!seat) throw new UnableToCreateSeatException();

    return seat;
  }
}
