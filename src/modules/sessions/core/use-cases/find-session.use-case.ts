/**
 * @fileoverview Use case for finding a session by ID.
 *
 * @description
 * This file contains the implementation of the FindSessionUseCase,
 * which handles the business logic for retrieving a specific session.
 *
 * @module find-session.use-case
 */

import { Injectable } from '@nestjs/common';
import { FindSessionDto } from '../dtos';
import { IFindSessionUseCase } from '../interfaces';
import { SessionsRepository } from '../repositories';
import { SessionSchema } from '../schemas';

/**
 * Use case responsible for finding a session by its unique identifier.
 *
 * @implements {IFindSessionUseCase}
 *
 * @example
 * const session = await findSessionUseCase.execute({ id: '550e8400-e29b-41d4-a716-446655440000' });
 */
@Injectable()
export class FindSessionUseCase implements IFindSessionUseCase {
  /**
   * Creates an instance of FindSessionUseCase.
   *
   * @param {SessionsRepository} sessionsRepository - Repository for session data operations.
   */
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  /**
   * Executes the session retrieval process.
   *
   * @param {FindSessionDto} dto - The data transfer object containing the session ID to find.
   * @returns {Promise<SessionSchema>} A promise that resolves to the found session.
   *
   * @example
   * const session = await findSessionUseCase.execute({ id: '550e8400-e29b-41d4-a716-446655440000' });
   * console.log(session.movieId);
   */
  async execute(dto: FindSessionDto): Promise<SessionSchema> {
    const session = await this.sessionsRepository.findById(dto.id);

    return session;
  }
}
