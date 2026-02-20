/**
 * @fileoverview Repositories for the Rooms schema.
 *
 * @description
 * This file contains the repository for the Rooms schema.
 *
 */

import { RoomInsertSchema, RoomSchema, roomsTable } from '../schemas';
import { Injectable } from '@nestjs/common';
import { UnableToCreateRoomException } from '../exceptions';
import { eq } from 'drizzle-orm';
import { RoomNotFoundException } from '../exceptions/room-not-found.exception';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { TransactionHost } from '@nestjs-cls/transactional';
import { DatabaseTransactionAdapter } from '../../../shared/database/database.provider';

/**
 * Repository class for managing room data persistence operations.
 * Provides methods for CRUD operations on the rooms table using Drizzle ORM.
 *
 * @class RoomsRepository
 * @injectable
 *
 * @example
 * // Inject and use in a service
 * constructor(private readonly roomsRepository: RoomsRepository) {}
 *
 * // Create a new room
 * const newRoom = await this.roomsRepository.insert({ name: 'Room 1' });
 * console.log(newRoom.id); // '550e8400-e29b-41d4-a716-446655440000'
 */
@Injectable()
export class RoomsRepository {
  constructor(
    private readonly txHost: TransactionHost<DatabaseTransactionAdapter>,
  ) {}

  /**
   * Finds a room by its unique identifier.
   *
   * @async
   * @param {string} id - The unique identifier (UUID) of the room to find.
   * @returns {Promise<RoomSchema>} A promise that resolves to the found room.
   * @throws {RoomNotFoundException} When no room is found with the given ID.
   *
   * @example
   * const room = await roomsRepository.findById('550e8400-e29b-41d4-a716-446655440000');
   * console.log(room.name); // 'Room 1'
   */
  async findById(id: string): Promise<RoomSchema> {
    const [room] = await this.txHost.tx
      .select()
      .from(roomsTable)
      .where(eq(roomsTable.id, id))
      .$withCache();

    if (!room) throw new RoomNotFoundException(id);

    return room;
  }

  /**
   * Retrieves a paginated list of rooms from the database.
   *
   * @async
   * @param {PaginationDto} pagination - The pagination parameters containing page number and limit.
   * @param {number} [pagination.page=1] - The page number to retrieve (1-indexed).
   * @param {number} [pagination.limit=10] - The maximum number of rooms per page.
   * @returns {Promise<PaginationResultDto<RoomSchema>>} A promise that resolves to a paginated result containing rooms and metadata.
   *
   * @example
   * // Get the first page with 10 rooms
   * const result = await roomsRepository.listWithPagination({ page: 1, limit: 10 });
   * console.log(result.data); // Array of RoomSchema
   * console.log(result.metadata.totalPages); // Total number of pages
   *
   * @example
   * // Get the second page with default limit
   * const result = await roomsRepository.listWithPagination({ page: 2 });
   * console.log(result.metadata.currentPage); // 2
   */
  async listWithPagination(
    pagination: PaginationDto,
  ): Promise<PaginationResultDto<RoomSchema>> {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const offset = (page - 1) * limit;

    const count = await this.txHost.tx.$count(roomsTable);
    const totalPages = Math.ceil(count / limit);

    const rooms = await this.txHost.tx
      .select()
      .from(roomsTable)
      .limit(limit)
      .offset(offset)
      .$withCache()
      .then((results) => results);

    return new PaginationResultDto<RoomSchema>({
      data: rooms,
      metadata: {
        currentPage: pagination.page,
        totalPages: totalPages,
        limit: limit,
      },
    });
  }

  /**
   * Inserts a new room into the database.
   *
   * @async
   * @param {RoomInsertSchema} data - The room data to insert, containing name.
   * @returns {Promise<RoomSchema>} A promise that resolves to the newly created room with generated ID and timestamps.
   * @throws {UnableToCreateRoomException} When the room cannot be created in the database.
   */
  async insert(data: RoomInsertSchema): Promise<RoomSchema> {
    const [room] = await this.txHost.tx
      .insert(roomsTable)
      .values(data)
      .returning();

    if (!room) throw new UnableToCreateRoomException();

    return room;
  }
}
