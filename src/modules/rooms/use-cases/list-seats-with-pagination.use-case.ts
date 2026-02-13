/**
 * @fileoverview Use case for listing seats with pagination support.
 *
 * @description
 * This file contains the ListSeatsWithPaginationUseCase class which handles
 * the business logic for retrieving paginated lists of seats within a specific room.
 *
 * @module list-seats-with-pagination.use-case
 */

import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { SeatsRepository } from '../repositories';
import { IListSeatsWithPaginationUseCase } from '../interfaces';
import { SeatSchema } from '../schemas';
import { ListSeatsWithPaginationDto } from '../dtos';
import { Injectable } from '@nestjs/common';

/**
 * Use case for listing seats with pagination.
 *
 * @description
 * This class implements the IListSeatsWithPaginationUseCase interface and provides
 * the functionality to retrieve a paginated list of seats for a specific room.
 * It delegates the data retrieval to the SeatsRepository.
 *
 * @class ListSeatsWithPaginationUseCase
 * @implements {IListSeatsWithPaginationUseCase}
 *
 * @example
 * // Using the use case to list seats
 * const result = await listSeatsWithPaginationUseCase.execute({
 *   roomId: '123e4567-e89b-12d3-a456-426614174000',
 *   page: 1,
 *   limit: 10
 * });
 */
@Injectable()
export class ListSeatsWithPaginationUseCase implements IListSeatsWithPaginationUseCase {
  /**
   * Creates an instance of ListSeatsWithPaginationUseCase.
   *
   * @param {SeatsRepository} seatsRepository - The repository for seat data operations.
   */
  constructor(private readonly seatsRepository: SeatsRepository) {}

  /**
   * Executes the list seats with pagination use case.
   *
   * @description
   * Retrieves a paginated list of seats for the specified room by delegating
   * to the seats repository with the provided pagination parameters.
   *
   * @param {ListSeatsWithPaginationDto} data - The DTO containing the room ID and pagination parameters.
   * @returns {Promise<PaginationResultDto<SeatSchema>>} A promise that resolves to a paginated result containing seat data.
   *
   * @example
   * const result = await useCase.execute({
   *   roomId: 'room-uuid',
   *   page: 2,
   *   limit: 20
   * });
   * // result.data contains the seats array
   * // result.metadata contains pagination info
   */
  async execute(
    data: ListSeatsWithPaginationDto,
  ): Promise<PaginationResultDto<SeatSchema>> {
    const result = await this.seatsRepository.listWithPagination(data.roomId, {
      page: data.page,
      limit: data.limit,
    });

    return result;
  }
}
