/**
 * @fileoverview Service layer for seat-related operations.
 *
 * @description
 * This file contains the SeatsService class which acts as a facade for seat operations,
 * delegating business logic to specific use cases for listing and creating seats.
 *
 * @module seats.service
 */

import {
  CreateSeatDto,
  ListSeatsDto,
  ListSeatsWithPaginationDto,
} from '../dtos';

import { SeatSchema } from '../schemas';
import { Injectable } from '@nestjs/common';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';

import { CreateSeatUseCase } from '../use-cases/create-seat.use-case';
import { ListSeatsWithPaginationUseCase } from '../use-cases/list-seats-with-pagination.use-case';
import { ListSeatsUseCase } from '../use-cases/list-seats.use-case';

/**
 * Service for managing seat operations.
 *
 * @description
 * This service provides methods for listing and creating seats within rooms.
 * It acts as a facade, delegating operations to specific use cases to maintain
 * separation of concerns and single responsibility principle.
 *
 * @class SeatsService
 *
 * @example
 * // Injecting and using the service
 * constructor(private readonly seatsService: SeatsService) {}
 *
 * // List seats with pagination
 * const paginatedSeats = await this.seatsService.listWithPagination({
 *   roomId: 'room-uuid',
 *   page: 1,
 *   limit: 10
 * });
 *
 * // List all seats
 * const allSeats = await this.seatsService.listAll({ roomId: 'room-uuid' });
 *
 * // Create a new seat
 * const newSeat = await this.seatsService.create({
 *   roomId: 'room-uuid',
 *   row: 'A',
 *   number: 1
 * });
 */
@Injectable()
export class SeatsService {
  /**
   * Creates an instance of SeatsService.
   *
   * @param {ListSeatsUseCase} listSeatsUseCase - Use case for listing all seats in a room.
   * @param {ListSeatsWithPaginationUseCase} listSeatsWithPaginationUseCase - Use case for listing seats with pagination.
   * @param {CreateSeatUseCase} createSeatUseCase - Use case for creating a new seat.
   */
  constructor(
    private readonly listSeatsUseCase: ListSeatsUseCase,
    private readonly listSeatsWithPaginationUseCase: ListSeatsWithPaginationUseCase,
    private readonly createSeatUseCase: CreateSeatUseCase,
  ) {}

  /**
   * Lists seats with pagination for a specific room.
   *
   * @description
   * Retrieves a paginated list of seats for the specified room by delegating
   * to the ListSeatsWithPaginationUseCase.
   *
   * @param {ListSeatsWithPaginationDto} data - The DTO containing room ID and pagination parameters.
   * @returns {Promise<PaginationResultDto<SeatSchema>>} A promise that resolves to a paginated result containing seat data.
   *
   * @example
   * const result = await seatsService.listWithPagination({
   *   roomId: '550e8400-e29b-41d4-a716-446655440000',
   *   page: 1,
   *   limit: 20
   * });
   * // result.data contains the seats array
   * // result.metadata contains pagination info
   */
  async listWithPagination(
    data: ListSeatsWithPaginationDto,
  ): Promise<PaginationResultDto<SeatSchema>> {
    return this.listSeatsWithPaginationUseCase.execute(data);
  }

  /**
   * Lists all seats for a specific room.
   *
   * @description
   * Retrieves all seats associated with the specified room without pagination
   * by delegating to the ListSeatsUseCase.
   *
   * @param {ListSeatsDto} data - The DTO containing the room identifier.
   * @returns {Promise<SeatSchema[]>} A promise that resolves to an array of all seats in the room.
   *
   * @example
   * const seats = await seatsService.listAll({
   *   roomId: '550e8400-e29b-41d4-a716-446655440000'
   * });
   * console.log(seats.length); // Number of seats in the room
   */
  async listAll(data: ListSeatsDto): Promise<SeatSchema[]> {
    return this.listSeatsUseCase.execute(data);
  }

  /**
   * Creates a new seat in a room.
   *
   * @description
   * Creates a new seat with the provided data by delegating to the CreateSeatUseCase.
   *
   * @param {CreateSeatDto} data - The DTO containing the seat creation data.
   * @returns {Promise<SeatSchema>} A promise that resolves to the newly created seat.
   *
   * @example
   * const newSeat = await seatsService.create({
   *   roomId: '550e8400-e29b-41d4-a716-446655440000',
   *   row: 'A',
   *   number: 1
   * });
   * console.log(newSeat.id); // The ID of the newly created seat
   */
  async create(data: CreateSeatDto): Promise<SeatSchema> {
    return this.createSeatUseCase.execute(data);
  }
}
