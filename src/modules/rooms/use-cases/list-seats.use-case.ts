/**
 * @fileoverview Use case for listing all seats in a room.
 *
 * @description
 * This file contains the ListSeatsUseCase class which implements the business logic
 * for retrieving all seats within a specific room without pagination.
 *
 * @module list-seats.use-case
 */

import { IListSeatsUseCase } from '../interfaces';
import { SeatsRepository } from '../repositories';
import { ListSeatsDto } from '../dtos';
import { SeatSchema } from '../schemas';
import { Injectable } from '@nestjs/common';

/**
 * Use case for listing all seats in a room.
 *
 * @description
 * This use case handles the business logic for retrieving all seats
 * associated with a specific room. It implements the IListSeatsUseCase
 * interface and delegates data access to the SeatsRepository.
 *
 * @class ListSeatsUseCase
 * @implements {IListSeatsUseCase}
 *
 * @example
 * // Using the use case
 * const seats = await listSeatsUseCase.execute({
 *   roomId: '550e8400-e29b-41d4-a716-446655440000'
 * });
 * console.log(seats); // Array of SeatSchema objects
 */
@Injectable()
export class ListSeatsUseCase implements IListSeatsUseCase {
  /**
   * Creates an instance of ListSeatsUseCase.
   *
   * @param {SeatsRepository} seatsRepository - The repository for seat data access operations.
   */
  constructor(private readonly seatsRepository: SeatsRepository) {}

  /**
   * Executes the list seats use case.
   *
   * @description
   * Retrieves all seats associated with the specified room identifier
   * by delegating to the seats repository.
   *
   * @param {ListSeatsDto} data - The data transfer object containing the room identifier.
   * @returns {Promise<SeatSchema[]>} A promise that resolves to an array of all seats in the room.
   *
   * @example
   * const seats = await listSeatsUseCase.execute({
   *   roomId: '550e8400-e29b-41d4-a716-446655440000'
   * });
   * console.log(seats.length); // Number of seats in the room
   */
  async execute(data: ListSeatsDto): Promise<SeatSchema[]> {
    const seats = await this.seatsRepository.listAll(data.roomId);

    return seats;
  }
}
