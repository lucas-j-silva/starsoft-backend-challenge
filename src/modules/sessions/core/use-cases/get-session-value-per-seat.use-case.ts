/**
 * @fileoverview Use case for getting the value per seat for a session.
 *
 * @description
 * This file contains the use case implementation for retrieving the value per seat
 * for a specific session by its identifier.
 *
 * @module get-session-value-per-seat.use-case
 */

import { Injectable } from '@nestjs/common';
import { GetSessionValuePerSeatDto } from '../dtos';
import { IGetSessionValuePerSeatUseCase } from '../interfaces/get-session-value-per-seat.use-case.interface';
import { SessionsRepository } from '../repositories';

/**
 * Use case for getting the value per seat for a session.
 *
 * @implements {IGetSessionValuePerSeatUseCase}
 */
@Injectable()
export class GetSessionValuePerSeatUseCase implements IGetSessionValuePerSeatUseCase {
  /**
   * Creates an instance of GetSessionValuePerSeatUseCase.
   *
   * @param {SessionsRepository} sessionsRepository - The repository for accessing session data.
   */
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  /**
   * Executes the get session value per seat use case.
   *
   * @param {GetSessionValuePerSeatDto} data - The data transfer object containing the session identifier.
   * @returns {Promise<number>} A promise that resolves to the value per seat in cents for the specified session.
   *
   * @example
   * const valuePerSeat = await getSessionValuePerSeatUseCase.execute({ id: '550e8400-e29b-41d4-a716-446655440000' });
   * console.log(valuePerSeat); // 1500 (value in cents)
   */
  async execute(data: GetSessionValuePerSeatDto): Promise<number> {
    const session = await this.sessionsRepository.findById(data.id);

    return session.valuePerSeatInCents;
  }
}
