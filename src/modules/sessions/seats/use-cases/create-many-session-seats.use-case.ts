/**
 * @fileoverview Use case for creating multiple session seats in bulk.
 *
 * @description
 * This file contains the use case responsible for creating multiple session seats
 * at once. It handles the bulk insertion of session seats for a given session.
 *
 * @module create-many-session-seats.use-case
 */

import { ICreateManySessionSeatsUseCase } from '../interfaces';
import { CreateManySessionSeatsDto } from '../dtos';
import { SessionSeatSchema } from '../schemas';
import { SessionSeatsRepository } from '../repositories';
import { Injectable } from '@nestjs/common';

/**
 * Use case for creating multiple session seats in bulk.
 *
 * @description
 * Handles the business logic for bulk creation of session seats.
 * Maps the provided seat data with the session ID and performs
 * a bulk insert operation through the repository.
 *
 * @class CreateManySessionSeatsUseCase
 * @implements {ICreateManySessionSeatsUseCase}
 */
@Injectable()
export class CreateManySessionSeatsUseCase implements ICreateManySessionSeatsUseCase {
  /**
   * Creates an instance of CreateManySessionSeatsUseCase.
   *
   * @param {SessionSeatsRepository} sessionSeatsRepository - The repository for session seat operations.
   */
  constructor(
    private readonly sessionSeatsRepository: SessionSeatsRepository,
  ) {}

  /**
   * Executes the bulk creation of session seats.
   *
   * @description
   * Maps each seat in the input data with the provided session ID
   * and performs a bulk insert operation to create all session seats.
   *
   * @param {CreateManySessionSeatsDto} data - The data containing session ID and seats to create.
   * @returns {Promise<SessionSeatSchema[]>} A promise that resolves to an array of created session seats.
   *
   * @example
   * const seats = await useCase.execute({
   *   sessionId: '550e8400-e29b-41d4-a716-446655440000',
   *   seats: [
   *     { seatId: 'seat-1', isAvailable: true },
   *     { seatId: 'seat-2', isAvailable: false, soldAt: new Date() },
   *   ],
   * });
   */
  async execute(data: CreateManySessionSeatsDto): Promise<SessionSeatSchema[]> {
    const result = await this.sessionSeatsRepository.bulkInsert(
      data.seats.map((seat) => ({ ...seat, sessionId: data.sessionId })),
    );

    return result;
  }
}
