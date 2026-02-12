/**
 * @fileoverview Data Transfer Object for finding a room by its unique identifier.
 *
 * @description
 * This DTO defines the validation rules and structure for room finding requests.
 * Used to validate incoming data when searching for a specific room by its ID.
 *
 * @module find-room-by-id.dto
 */

import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for finding a room by its unique identifier.
 *
 * @description This DTO validates the input when searching for a specific room by ID.
 * It ensures the provided ID is a valid, non-empty UUID string.
 *
 * @example
 * // Valid usage
 * const dto = new FindRoomByIdDto();
 * dto.id = '550e8400-e29b-41d4-a716-446655440000';
 */
export class FindRoomByIdDto {
  /**
   * The unique identifier of the room to find.
   *
   * @type {string}
   * @description Must be a valid UUID v4 string format.
   * @example '550e8400-e29b-41d4-a716-446655440000'
   */
  @IsString({ message: 'validation.INVALID_STRING' })
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  id: string;
}
