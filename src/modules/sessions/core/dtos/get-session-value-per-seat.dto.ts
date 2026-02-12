/**
 * @fileoverview Data Transfer Object for retrieving the value per seat of a session.
 *
 * @description
 * This file contains the GetSessionValuePerSeatDto class which is used to validate and transfer
 * the session ID when fetching the price per seat for a specific session.
 *
 * @module get-session-value-per-seat.dto
 */

import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for retrieving the value per seat of a session.
 *
 * @description
 * This DTO is used to validate and transfer the session ID when
 * fetching the price per seat for a specific session.
 *
 * @class GetSessionValuePerSeatDto
 *
 * @example
 * // Example usage
 * const dto = new GetSessionValuePerSeatDto({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 * });
 */
export class GetSessionValuePerSeatDto {
  /**
   * The UUID of the session to retrieve the value per seat for.
   *
   * @type {string}
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  id: string;

  /**
   * Creates an instance of GetSessionValuePerSeatDto.
   *
   * @param {Partial<GetSessionValuePerSeatDto>} data - Partial data to initialize the DTO
   */
  constructor(data: Partial<GetSessionValuePerSeatDto>) {
    Object.assign(this, data);
  }
}
