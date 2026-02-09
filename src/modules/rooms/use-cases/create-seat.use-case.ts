/**
 * @fileoverview Use case for creating a new seat in a room.
 *
 * @description
 * This file contains the use case implementation for creating a new seat
 * within a specific room in the system.
 *
 * @module create-seat.use-case
 */

import { Injectable } from '@nestjs/common';
import { CreateSeatDto } from '../dtos';
import { ICreateSeatUseCase } from '../interfaces';
import { SeatsRepository } from '../repositories';
import { SeatSchema } from '../schemas';
import { RoomsService } from '../services/rooms.service';
import { SeatAlreadyExistsException } from '../exceptions/seat-already-exists.exception';

/**
 * Use case class for creating a new seat in a room.
 * Implements the ICreateSeatUseCase interface to follow the use case pattern.
 *
 * @class CreateSeatUseCase
 * @implements {ICreateSeatUseCase}
 *
 * @example
 * // Inject and use in a controller or service
 * const createSeatUseCase = new CreateSeatUseCase(seatsRepository, roomsService);
 * const seat = await createSeatUseCase.execute({
 *   roomId: '550e8400-e29b-41d4-a716-446655440000',
 *   row: 1,
 *   column: 5
 * });
 * console.log(seat.id); // The newly created seat's ID
 */
@Injectable()
export class CreateSeatUseCase implements ICreateSeatUseCase {
  /**
   * Creates an instance of CreateSeatUseCase.
   *
   * @param {SeatsRepository} seatsRepository - The repository for seat data persistence operations.
   * @param {RoomsService} roomService - The service for room-related operations.
   */
  constructor(
    private readonly seatsRepository: SeatsRepository,
    private readonly roomService: RoomsService,
  ) {}

  /**
   * Executes the create seat use case.
   *
   * @async
   * @param {CreateSeatDto} data - The data transfer object containing the seat creation details.
   * @returns {Promise<SeatSchema>} A promise that resolves to the newly created seat.
   *
   * @example
   * const seat = await createSeatUseCase.execute({
   *   roomId: '550e8400-e29b-41d4-a716-446655440000',
   *   row: 1,
   *   column: 5
   * });
   * console.log(seat.row); // 1
   * console.log(seat.column); // 5
   */
  async execute(data: CreateSeatDto): Promise<SeatSchema> {
    const room = await this.roomService.findById(data.roomId);

    const seatAlreadyExists = await this.seatsRepository
      .findByRoomIdAndRowAndColumn(data.roomId, data.row, data.column)
      .then(() => true)
      .catch(() => null);

    if (seatAlreadyExists) throw new SeatAlreadyExistsException();

    const seat = await this.seatsRepository.insert({
      roomId: room.id,
      row: data.row,
      column: data.column,
    });

    return seat;
  }
}
