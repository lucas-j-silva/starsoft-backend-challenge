/**
 * @fileoverview Use case for listing rooms with pagination.
 *
 * @description
 * This file contains the use case implementation for listing rooms with pagination.
 *
 * @module list-rooms-with-pagination.use-case
 */

import { ListRoomsWithPaginationDto } from '../dtos';
import { IListRoomsWithPaginationUseCase } from '../interfaces';
import { RoomsRepository } from '../repositories';
import { PaginationResultDto } from 'src/shared/dtos/pagination-result.dto';
import { RoomSchema } from '../schemas';
import { Injectable } from '@nestjs/common';

/**
 * Use case class for listing rooms with pagination.
 * Implements the IListRoomsWithPaginationUseCase interface to follow the use case pattern.
 *
 * @class ListRoomsWithPaginationUseCase
 * @implements {IListRoomsWithPaginationUseCase}
 *
 * @example
 * // Inject and use in a controller or service
 * const listRoomsWithPaginationUseCase = new ListRoomsWithPaginationUseCase(roomsRepository);
 * const result = await listRoomsWithPaginationUseCase.execute({ page: 1, limit: 10 });
 * console.log(result.data); // Array of RoomSchema
 * console.log(result.metadata.totalPages); // Total number of pages
 */
@Injectable()
export class ListRoomsWithPaginationUseCase implements IListRoomsWithPaginationUseCase {
  /**
   * Creates an instance of ListRoomsWithPaginationUseCase.
   *
   * @param {RoomsRepository} roomsRepository - The repository for room data persistence operations.
   */
  constructor(private readonly roomsRepository: RoomsRepository) {}

  /**
   * Executes the list rooms with pagination use case.
   *
   * @param {ListRoomsWithPaginationDto} pagination - The data transfer object containing the pagination parameters.
   * @returns {Promise<PaginationResultDto<RoomSchema>>} A promise that resolves to a paginated result containing rooms and metadata.
   *
   * @example
   * const result = await listRoomsWithPaginationUseCase.execute({ page: 1, limit: 10 });
   * console.log(result.data); // Array of rooms
   * console.log(result.metadata.totalPages); // Total number of pages
   */
  async execute(
    pagination: ListRoomsWithPaginationDto,
  ): Promise<PaginationResultDto<RoomSchema>> {
    const result = await this.roomsRepository.listWithPagination(pagination);

    return result;
  }
}
