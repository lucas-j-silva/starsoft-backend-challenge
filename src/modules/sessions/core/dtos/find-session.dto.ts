/**
 * @fileoverview Data Transfer Object for finding a cinema session by ID.
 *
 * @description
 * This file contains the DTO class used to validate and transfer data
 * when finding a cinema session by its unique identifier. It includes
 * validation decorators from class-validator to ensure data integrity.
 *
 * @module find-session.dto
 */

import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for finding a cinema session by ID.
 *
 * @description
 * This DTO validates the required fields for finding a session,
 * specifically the session's unique identifier (UUID).
 *
 * @class FindSessionDto
 *
 * @example
 * // Example usage in a controller
 * const dto = new FindSessionDto({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 * });
 */
export class FindSessionDto {
  /**
   * The UUID of the session to find.
   *
   * @type {string}
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  id: string;

  /**
   * Creates an instance of FindSessionDto.
   *
   * @param {Partial<FindSessionDto>} data - Partial data to initialize the DTO.
   */
  constructor(data: Partial<FindSessionDto>) {
    Object.assign(this, data);
  }
}
