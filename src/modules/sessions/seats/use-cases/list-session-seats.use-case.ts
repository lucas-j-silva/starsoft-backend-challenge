/**
 * @fileoverview Use case for listing all session seats for a given session.
 *
 * @description
 * This file contains the use case responsible for retrieving all session seats
 * associated with a specific session. It includes seat relations such as
 * seat details and session information.
 *
 * @module list-session-seats.use-case
 */

import { ListSessionSeatsDto } from '../dtos';
import { IListSessionSeatsUseCase } from '../interfaces';
import { SessionSeatsRepository } from '../repositories';
import { SessionSeatSchemaWithRelations } from '../schemas';
import { Injectable } from '@nestjs/common';

/**
 * Use case for listing all session seats for a specific session.
 *
 * @description
 * Handles the business logic for retrieving all session seats associated
 * with a given session ID. Returns session seats with their related
 * seat and session information.
 *
 * @class ListSessionSeatsUseCase
 * @implements {IListSessionSeatsUseCase}
 */
@Injectable()
export class ListSessionSeatsUseCase implements IListSessionSeatsUseCase {
  /**
   * Creates an instance of ListSessionSeatsUseCase.
   *
   * @param {SessionSeatsRepository} sessionSeatsRepository - The repository for session seat operations.
   */
  constructor(
    private readonly sessionSeatsRepository: SessionSeatsRepository,
  ) {}

  /**
   * Executes the retrieval of all session seats for a given session.
   *
   * @description
   * Fetches all session seats associated with the provided session ID,
   * including their related seat and session data.
   *
   * @param {ListSessionSeatsDto} data - The data containing the session ID to query.
   * @returns {Promise<SessionSeatSchemaWithRelations[]>} A promise that resolves to an array of session seats with relations.
   *
   * @example
   * const seats = await useCase.execute({ id: '550e8400-e29b-41d4-a716-446655440000' });
   * // Returns: [{ id: '...', isAvailable: true, relations: { seat: {...}, session: {...} } }, ...]
   */
  async execute(
    data: ListSessionSeatsDto,
  ): Promise<SessionSeatSchemaWithRelations[]> {
    const sessionSeats = await this.sessionSeatsRepository.listAll(data.id);

    return sessionSeats;
  }
}
