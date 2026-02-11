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
  IsNumber,
  IsNotEmpty,
  IsUUID,
  IsDate,
  IsBoolean,
  IsOptional,
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
 * const createSessionDto: CreateSessionDto = {
 *   movieId: '550e8400-e29b-41d4-a716-446655440000',
 *   roomId: '660e8400-e29b-41d4-a716-446655440001',
 *   valuePerSeatInCents: 2500,
 *   startTime: new Date('2024-01-15T19:00:00Z'),
 * };
 */
export class CreateSessionDto {
  /**
   * The UUID of the movie to be shown in this session.
   *
   * @type {string}
   */
  @IsNotEmpty()
  @IsUUID()
  movieId: string;

  /**
   * The UUID of the room where the session will take place.
   *
   * @type {string}
   */
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  /**
   * The price per seat in cents (e.g., 2500 = $25.00).
   *
   * @type {number}
   */
  @IsNotEmpty()
  @IsNumber()
  valuePerSeatInCents: number;

  /**
   * The date and time when the session starts.
   *
   * @type {Date}
   */
  @IsNotEmpty()
  @IsDate()
  startTime: Date;

  /**
   * Whether to copy the seats from the selected room.
   *
   * @type {boolean}
   */
  @IsOptional()
  @IsBoolean()
  copySeats?: boolean;
}
