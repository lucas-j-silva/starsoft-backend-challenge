/**
 * @fileoverview Data Transfer Object for creating a new cinema session.
 *
 * @description
 * This file contains the DTO class used to validate and transfer data
 * when creating a new cinema session. It includes validation decorators
 * from class-validator to ensure data integrity.
 *
 * @module create-session.dto
 */

import {
  IsNotEmpty,
  IsUUID,
  IsDate,
  IsBoolean,
  IsOptional,
  IsInt,
} from 'class-validator';

/**
 * Data Transfer Object for creating a new cinema session.
 *
 * @description
 * This DTO validates the required fields for creating a session,
 * including the movie reference, room reference, ticket price,
 * and session start time.
 *
 * @class CreateSessionDto
 *
 * @example
 * // Example usage in a controller
 * const dto = new CreateSessionDto({
 *   movieId: '550e8400-e29b-41d4-a716-446655440000',
 *   roomId: '660e8400-e29b-41d4-a716-446655440001',
 *   valuePerSeatInCents: 2500,
 *   startTime: new Date('2024-01-15T19:00:00Z'),
 * });
 */
export class CreateSessionDto {
  /**
   * The UUID of the movie to be shown in this session.
   *
   * @type {string}
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  movieId: string;

  /**
   * The UUID of the room where the session will take place.
   *
   * @type {string}
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  roomId: string;

  /**
   * The price per seat in cents (e.g., 2500 = $25.00).
   *
   * @type {number}
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsInt({ message: 'validation.IS_INT' })
  valuePerSeatInCents: number;

  /**
   * The date and time when the session starts.
   *
   * @type {Date}
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsDate({ message: 'validation.INVALID_DATE' })
  startTime: Date;

  /**
   * Whether to copy the seats from the selected room.
   *
   * @type {boolean}
   */
  @IsOptional({ message: 'validation.IS_OPTIONAL' })
  @IsBoolean({ message: 'validation.INVALID_BOOLEAN' })
  copySeats?: boolean;

  /**
   * Creates an instance of CreateSessionDto.
   *
   * @param {Partial<CreateSessionDto>} data - Partial data to initialize the DTO.
   */
  constructor(data: Partial<CreateSessionDto>) {
    Object.assign(this, data);
  }
}
