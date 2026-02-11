/**
 * @fileoverview Use case for updating a session.
 *
 * @description
 * This file contains the use case implementation for updating a session.
 *
 * @module update-session.use-case
 */

import { IUpdateSessionUseCase } from '../interfaces';
import { UpdateSessionDto } from '../dtos';
import { SessionSchema } from '../schemas';
import { SessionsRepository } from '../repositories';
import { Injectable } from '@nestjs/common';
import { UnableToUpdateSessionException } from '../exceptions/unable-to-update-session.exception';

/**
 * Use case for updating a session.
 *
 * @implements {IUpdateSessionUseCase}
 */
@Injectable()
export class UpdateSessionUseCase implements IUpdateSessionUseCase {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  /**
   * Executes the update session use case.
   *
   * @param {UpdateSessionDto} data - The data transfer object containing session update details.
   * @returns {Promise<SessionSchema>} A promise that resolves to the updated session.
   * @throws {UnableToUpdateSessionException} When the session cannot be updated.
   *
   * @example
   * const updatedSession = await updateSessionUseCase.execute({
   *   id: '550e8400-e29b-41d4-a716-446655440000',
   *   valuePerSeatInCents: 2500,
   *   startTime: new Date('2024-12-25T19:00:00'),
   * });
   * console.log(updatedSession); // SessionSchema
   */
  async execute(data: UpdateSessionDto): Promise<SessionSchema> {
    if (!data.valuePerSeatInCents && !data.startTime) {
      throw new UnableToUpdateSessionException(
        'At least one field to update must be provided',
      );
    }

    const session = await this.sessionsRepository.findById(data.id);

    const updatedSession = await this.sessionsRepository.update(session.id, {
      valuePerSeatInCents: data.valuePerSeatInCents,
      startTime: data.startTime,
    });

    return updatedSession;
  }
}
