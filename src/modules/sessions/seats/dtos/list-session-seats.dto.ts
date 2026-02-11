/**
 * @fileoverview Data Transfer Object for listing session seats.
 *
 * @description
 * This file contains the ListSessionSeatsDto class which is used to validate and transfer
 * the required parameters for listing session seats.
 *
 * @module list-session-seats.dto
 */

import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for listing session seats.
 *
 * @description
 * This DTO is used to validate and transfer the required parameters
 * for listing session seats.
 *
 * @class ListSessionSeatsDto
 * @example
 * // Creating a new ListSessionSeatsDto instance
 * const listSessionSeatsDto = new ListSessionSeatsDto({
 *   id: '550e8400-e29b-41d4-a716-446655440000'
 * });
 */
export class ListSessionSeatsDto {
  /**
   * The unique identifier of the session to list seats for.
   *
   * @type {string}
   * @memberof ListSessionSeatsDto
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440000'
   */
  @IsNotEmpty()
  @IsUUID()
  id: string;

  /**
   * Creates an instance of ListSessionSeatsDto.
   *
   * @param {Partial<ListSessionSeatsDto>} data - Partial data to initialize the DTO.
   */
  constructor(data: Partial<ListSessionSeatsDto>) {
    Object.assign(this, data);
  }
}
