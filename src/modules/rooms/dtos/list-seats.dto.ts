/**
 * @fileoverview Data Transfer Object for listing seats in a room.
 *
 * @description
 * This file contains the ListSeatsDto class which is used to validate and transfer
 * the required parameters for listing seats within a specific room.
 *
 * @module list-seats.dto
 */

import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for listing all seats in a room.
 *
 * @description
 * This DTO is used to validate and transfer the required parameters
 * for listing all seats within a specific room.
 *
 * @class ListSeatsDto
 *
 * @example
 * // Creating a new ListSeatsDto instance
 * const listSeatsDto = new ListSeatsDto({
 *   roomId: '550e8400-e29b-41d4-a716-446655440000'
 * });
 */
export class ListSeatsDto {
  /**
   * The unique identifier of the room to list seats from.
   *
   * @type {string}
   * @memberof ListSeatsDto
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440000'
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  roomId: string;

  /**
   * Creates an instance of ListSeatsDto.
   *
   * @param {Partial<ListSeatsDto>} data - Partial data to initialize the DTO.
   */
  constructor(data: Partial<ListSeatsDto>) {
    Object.assign(this, data);
  }
}
