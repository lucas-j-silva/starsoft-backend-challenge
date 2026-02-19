/**
 * @fileoverview Data Transfer Object for creating a new seat in a room.
 *
 * @description
 * This file contains the DTO class used to validate and transfer data
 * when creating a new seat within a room. Seats are identified by their
 * row (letter) and column (number) combination.
 *
 * @module create-seat.dto
 */

import { ApiProperty, ApiSchema, PickType } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

/**
 * Data Transfer Object for creating a new seat.
 *
 * @description
 * Validates and encapsulates the data required to create a new seat in a room.
 * Each seat is uniquely identified by its room, row, and column combination.
 *
 * @class CreateSeatDto
 *
 * @example
 * // Create a new seat DTO for seat A12 in a specific room
 * const createSeatDto = new CreateSeatDto({
 *   roomId: '550e8400-e29b-41d4-a716-446655440000',
 *   row: 'A',
 *   column: 12,
 * });
 */
@ApiSchema({
  name: 'CreateSeatDto',
  description: 'Data Transfer Object for creating a new seat',
})
export class CreateSeatDto {
  /**
   * The unique identifier of the room where the seat will be created.
   *
   * @type {string}
   * @memberof CreateSeatDto
   * @example '550e8400-e29b-41d4-a716-446655440000'
   */
  @ApiProperty({
    description:
      'The unique identifier of the room where the seat will be created',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString({ message: 'validation.INVALID_STRING' })
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  roomId: string;

  /**
   * The row identifier for the seat (typically a letter).
   *
   * @type {string}
   * @memberof CreateSeatDto
   * @example 'A' - represents row A (e.g., A1, A2, A12)
   */
  @ApiProperty({
    description: 'The row identifier for the seat (typically a letter)',
    example: 'A',
  })
  @IsString({ message: 'validation.INVALID_STRING' })
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  row: string;

  /**
   * The column number for the seat within the row.
   *
   * @type {number}
   * @memberof CreateSeatDto
   * @example 12 - combined with row 'A' gives seat 'A12'
   */
  @ApiProperty({
    description: 'The column number for the seat within the row',
    example: 12,
  })
  @IsInt({ message: 'validation.IS_INT' })
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsPositive({ message: 'validation.IS_POSITIVE' })
  column: number;

  /**
   * Creates an instance of CreateSeatDto.
   *
   * @param {Partial<CreateSeatDto>} data - Partial data to initialize the DTO.
   *
   * @example
   * const dto = new CreateSeatDto({ roomId: 'uuid', row: 'B', column: 5 });
   */
  constructor(data: Partial<CreateSeatDto>) {
    Object.assign(this, data);
  }
}

/**
 * Data Transfer Object for the seat creation request body.
 *
 * @description
 * Extends a subset of CreateSeatDto, picking only 'row' and 'column' fields.
 * The roomId is excluded as it is provided via the URL path parameter.
 *
 * @class CreateSeatBodyDto
 * @extends {PickType<CreateSeatDto, 'row' | 'column'>}
 *
 * @example
 * // Request body for creating seat A12
 * {
 *   "row": "A",
 *   "column": 12
 * }
 */
@ApiSchema({
  name: 'CreateSeatBodyDto',
  description: 'Data Transfer Object for the seat creation request body',
})
export class CreateSeatBodyDto extends PickType(CreateSeatDto, [
  'row',
  'column',
]) {}
