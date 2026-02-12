/**
 * @fileoverview DTO for creating a single session seat.
 *
 * @description
 * This file contains the Data Transfer Object used for creating individual session seats.
 * It validates the seat identifier, availability status, and optional sold timestamp.
 *
 * @module create-session-seat.dto
 */

import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

/**
 * Data Transfer Object for creating a session seat.
 *
 * @description
 * Validates and transfers data for session seat creation operations.
 * Ensures the seat ID is a valid UUID, availability is a boolean,
 * and optionally includes a sold timestamp.
 *
 * @class CreateSessionSeatDto
 *
 * @example
 * const createSeatDto = new CreateSessionSeatDto({
 *   seatId: '550e8400-e29b-41d4-a716-446655440000',
 *   isAvailable: true,
 * });
 *
 * @example
 * const soldSeatDto = new CreateSessionSeatDto({
 *   seatId: '550e8400-e29b-41d4-a716-446655440000',
 *   isAvailable: false,
 *   soldAt: new Date('2024-01-15T19:30:00Z'),
 * });
 */
export class CreateSessionSeatDto {
  /**
   * The unique identifier of the seat to associate with the session.
   *
   * @type {string}
   * @memberof CreateSessionSeatDto
   *
   * @example
   * seatId: '550e8400-e29b-41d4-a716-446655440000'
   */
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  seatId: string;

  /**
   * Indicates whether the seat is available for booking.
   *
   * @type {boolean}
   * @memberof CreateSessionSeatDto
   *
   * @example
   * isAvailable: true
   */
  @IsBoolean({ message: 'validation.INVALID_BOOLEAN' })
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  isAvailable: boolean;

  /**
   * The timestamp when the seat was sold.
   * Optional field, only set when the seat has been purchased.
   *
   * @type {Date}
   * @memberof CreateSessionSeatDto
   * @optional
   *
   * @example
   * soldAt: new Date('2024-01-15T19:30:00Z')
   */
  @IsDate({ message: 'validation.INVALID_DATE' })
  @IsOptional()
  soldAt?: Date;

  /**
   * Creates an instance of CreateSessionSeatDto.
   *
   * @param {Partial<CreateSessionSeatDto>} data - Partial data to initialize the DTO.
   */
  constructor(data: Partial<CreateSessionSeatDto>) {
    Object.assign(this, data);
  }
}
