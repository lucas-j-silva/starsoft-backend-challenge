/**
 * @fileoverview DTO for creating multiple session seats in a single operation.
 *
 * @description
 * This file contains the Data Transfer Object used for bulk creation of session seats.
 * It validates the session identifier and an array of seat creation data.
 *
 * @module create-many-session-seats.dto
 */

import {
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsNotEmptyObject,
  IsUUID,
} from 'class-validator';
import { CreateSessionSeatDto } from './create-session-seat.dto';
import { Type } from 'class-transformer';

/**
 * Data Transfer Object for creating multiple session seats.
 *
 * @description
 * Validates and transfers data for bulk session seat creation operations.
 * Ensures the session ID is a valid UUID and the seats array contains valid seat data.
 *
 * @class CreateManySessionSeatsDto
 *
 * @example
 * const createManySeatsDto = new CreateManySessionSeatsDto({
 *   sessionId: '550e8400-e29b-41d4-a716-446655440000',
 *   seats: [
 *     { row: 'A', number: 1 },
 *     { row: 'A', number: 2 },
 *   ]
 * });
 */
export class CreateManySessionSeatsDto {
  /**
   * The unique identifier of the session to which the seats belong.
   *
   * @type {string}
   * @memberof CreateManySessionSeatsDto
   *
   * @example
   * sessionId: '550e8400-e29b-41d4-a716-446655440000'
   */
  @IsUUID()
  @IsNotEmpty()
  sessionId: string;

  /**
   * Array of seat data to be created for the session.
   *
   * @type {CreateSessionSeatDto[]}
   * @memberof CreateManySessionSeatsDto
   *
   * @example
   * seats: [
   *   { seatId: 'seat-1', isAvailable: true },
   *   { seatId: 'seat-2', isAvailable: true },
   * ]
   */
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateSessionSeatDto)
  @IsNotEmptyObject()
  seats: CreateSessionSeatDto[];

  /**
   * Creates an instance of CreateManySessionSeatsDto.
   *
   * @param {Partial<CreateManySessionSeatsDto>} data - Partial data to initialize the DTO.
   */
  constructor(data: Partial<CreateManySessionSeatsDto>) {
    Object.assign(this, data);
  }
}
