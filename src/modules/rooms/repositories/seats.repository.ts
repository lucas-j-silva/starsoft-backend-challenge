/**
 * @fileoverview Repository for the Seats schema.
 *
 * @description
 * This file contains the repository for the Seats schema, providing
 * data persistence operations for seat entities within rooms.
 *
 * @module seats.repository
 */

import { Injectable } from '@nestjs/common';
import { SeatInsertSchema, SeatSchema, seatsTable } from '../schemas';
import { UnableToCreateSeatException } from '../exceptions/unable-to-create-seat.exception';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { and, eq } from 'drizzle-orm';
import { SeatNotFoundException } from '../exceptions/seat-not-found.exception';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DatabaseTransactionAdapter } from '../../../shared/database/database.provider';

/**
 * Repository class for managing seat data persistence operations.
 * Provides methods for CRUD operations on the seats table using Drizzle ORM.
 *
 * @class SeatsRepository
 * @injectable
 *
 * @example
 * // Inject and use in a service
 * constructor(private readonly seatsRepository: SeatsRepository) {}
 *
 * // List all seats in a room
 * const seats = await this.seatsRepository.listAll('room-uuid');
 *
 * // Create a new seat
 * const newSeat = await this.seatsRepository.insert({ roomId: 'room-uuid', row: 'A', column: 1 });
 */
@Injectable()
export class SeatsRepository {
  constructor(
    private readonly txHost: TransactionHost<DatabaseTransactionAdapter>,
  ) {}

  /**
   * Retrieves a paginated list of seats for a specific room.
   *
   * @async
   * @param {string} roomId - The unique identifier (UUID) of the room to list seats from.
   * @param {PaginationDto} pagination - The pagination parameters containing page and limit.
   * @returns {Promise<PaginationResultDto<SeatSchema>>} A promise that resolves to a paginated result containing seats and metadata.
   *
   * @example
   * const result = await seatsRepository.listWithPagination(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   { page: 1, limit: 10 }
   * );
   * console.log(result.data); // Array of SeatSchema
   * console.log(result.metadata.totalPages); // Total number of pages
   */
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

  /**
   * Retrieves all seats for a specific room without pagination.
   *
   * @async
   * @param {string} roomId - The unique identifier (UUID) of the room to list seats from.
   * @returns {Promise<SeatSchema[]>} A promise that resolves to an array of all seats in the room.
   *
   * @example
   * const seats = await seatsRepository.listAll('550e8400-e29b-41d4-a716-446655440000');
   * console.log(seats.length); // Number of seats in the room
   */
  async listAll(roomId: string): Promise<SeatSchema[]> {
    const seats = await this.txHost.tx
      .select()
      .from(seatsTable)
      .where(eq(seatsTable.roomId, roomId));

    return seats;
  }

  /**
   * Inserts a new seat into the database.
   *
   * @async
   * @param {SeatInsertSchema} data - The seat data to insert.
   * @returns {Promise<SeatSchema>} A promise that resolves to the newly created seat.
   * @throws {UnableToCreateSeatException} When the seat creation fails.
   *
   * @example
   * const newSeat = await seatsRepository.insert({
   *   roomId: '550e8400-e29b-41d4-a716-446655440000',
   *   row: 'A',
   *   column: 1
   * });
   * console.log(newSeat.id); // UUID of the new seat
   */
  async insert(data: SeatInsertSchema): Promise<SeatSchema> {
    const [seat] = await this.txHost.tx
      .insert(seatsTable)
      .values(data)
      .returning();

    if (!seat) throw new UnableToCreateSeatException();

    return seat;
  }

  /**
   * Finds a seat by its room ID, row, and column position.
   *
   * @async
   * @param {string} roomId - The unique identifier (UUID) of the room.
   * @param {string} row - The row identifier of the seat (e.g., 'A', 'B', 'C').
   * @param {number} column - The column number of the seat.
   * @returns {Promise<SeatSchema | null>} A promise that resolves to the found seat or null.
   * @throws {SeatNotFoundException} When no seat is found with the given criteria.
   *
   * @example
   * const seat = await seatsRepository.findByRoomIdAndRowAndColumn(
   *   '550e8400-e29b-41d4-a716-446655440000',
   *   'A',
   *   5
   * );
   * console.log(seat.id); // UUID of the found seat
   */
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
