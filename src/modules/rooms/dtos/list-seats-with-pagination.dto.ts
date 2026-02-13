/**
 * @fileoverview Data Transfer Object for listing seats with pagination.
 *
 * @description
 * This file contains the ListSeatsWithPaginationDto class which extends
 * PaginationDto to provide pagination capabilities when listing seats
 * for a specific room.
 *
 * @module list-seats-with-pagination.dto
 */

import { IsNotEmpty, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';

/**
 * DTO for listing seats with pagination support.
 *
 * @description
 * This class extends PaginationDto to include room-specific filtering
 * when retrieving paginated lists of seats. It combines pagination
 * parameters with a room identifier.
 *
 * @class ListSeatsWithPaginationDto
 * @extends {PaginationDto}
 *
 * @example
 * // Creating a DTO to list seats for a specific room
 * const dto = new ListSeatsWithPaginationDto({
 *   roomId: '123e4567-e89b-12d3-a456-426614174000',
 *   page: 1,
 *   limit: 10
 * });
 */
export class ListSeatsWithPaginationDto extends PaginationDto {
  /**
   * The unique identifier of the room to list seats for.
   *
   * @type {string}
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  roomId: string;

  /**
   * Creates an instance of ListSeatsWithPaginationDto.
   *
   * @description
   * Initializes the DTO by calling the parent constructor and
   * assigning all provided properties to the instance.
   *
   * @param {Partial<ListSeatsWithPaginationDto>} data - Partial object containing DTO properties.
   *
   * @example
   * const dto = new ListSeatsWithPaginationDto({
   *   roomId: 'room-uuid',
   *   page: 2,
   *   limit: 20
   * });
   */
  constructor(data: Partial<ListSeatsWithPaginationDto>) {
    super();

    Object.assign(this, data);
  }
}
