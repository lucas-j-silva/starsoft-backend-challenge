/**
 * @fileoverview Use case for creating a new session.
 *
 * @description
 * This file contains the implementation of the CreateSessionUseCase,
 * which handles the business logic for creating new sessions.
 *
 * @module create-session.use-case
 */

import { CreateSessionDto } from '../dtos';
import { SessionSchema } from '../schemas';
import { ICreateSessionUseCase } from '../interfaces';
import { Injectable } from '@nestjs/common';
import { SessionsRepository } from '../repositories';
import { RoomsService, SeatsService } from 'src/modules/rooms/services';
import { MoviesService } from 'src/modules/movies/services';
import { NotEnoughSeatsException } from '../exceptions';
import { SessionSeatsService } from '../../seats/services';

/**
 * Use case responsible for creating new sessions.
 *
 * @implements {ICreateSessionUseCase}
 */
@Injectable()
export class CreateSessionUseCase implements ICreateSessionUseCase {
  private readonly MIN_SESSION_SEATS = 16;

  /**
   * Creates an instance of CreateSessionUseCase.
   *
   * @param {SessionsRepository} sessionsRepository - Repository for session data operations.
   * @param {RoomsService} roomsService - Service for room data operations.
   * @param {SeatsService} seatsService - Service for seat data operations.
   * @param {MoviesService} moviesService - Service for movie data operations.
   */
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly roomsService: RoomsService,
    private readonly seatsService: SeatsService,
    private readonly moviesService: MoviesService,
    private readonly sessionSeatsService: SessionSeatsService,
  ) {}

  /**
   * Executes the session creation process.
   *
   * @param {CreateSessionDto} data - The data transfer object containing session creation details.
   * @returns {Promise<SessionSchema>} A promise that resolves to the created session.
   * @throws {UnableToCreateSessionException} When the session cannot be created.
   * @throws {NotEnoughSeatsException} When the selected room does not have enough seats.
   * @throws {UnableToCreateBulkSessionSeatsException} When the bulk session seats cannot be created.
   *
   * @example
   * const newSession = await createSessionUseCase.execute({
   *   movieId: '550e8400-e29b-41d4-a716-446655440000',
   *   roomId: '660e8400-e29b-41d4-a716-446655440001',
   *   valuePerSeatInCents: 2500,
   *   startTime: new Date('2024-01-15T19:00:00Z')
   * });
   */
  async execute(data: CreateSessionDto): Promise<SessionSchema> {
    const room = await this.roomsService.findById(data.roomId);
    const movie = await this.moviesService.findById(data.movieId);
    const roomSeats = await this.seatsService.listAll({ roomId: room.id });

    if (roomSeats.length < this.MIN_SESSION_SEATS)
      throw new NotEnoughSeatsException();

    const session = await this.sessionsRepository.insert({
      roomId: room.id,
      movieId: movie.id,
      startTime: data.startTime,
      valuePerSeatInCents: data.valuePerSeatInCents,
    });

    if (data.copySeats) {
      await this.sessionSeatsService.createMany({
        sessionId: session.id,
        seats: roomSeats.map((seat) => ({
          seatId: seat.id,
          isAvailable: true,
        })),
      });
    }

    return session;
  }
}
