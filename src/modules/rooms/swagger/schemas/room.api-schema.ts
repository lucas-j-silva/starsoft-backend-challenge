/**
 * @fileoverview Swagger API schema for room entity.
 *
 * @description
 * This file defines the API schema used for Swagger documentation
 * of room-related endpoints. It provides type definitions and examples
 * for the room entity response structure.
 *
 * @module room-api.schema
 */

import { ApiProperty, ApiSchema } from '@nestjs/swagger';

/**
 * Swagger API schema representing a room entity.
 *
 * @description
 * Defines the structure and documentation for room responses in the API.
 * Used by Swagger to generate accurate API documentation with examples.
 *
 * @class RoomApiSchema
 *
 * @example
 * // Example room response
 * {
 *   "id": "123e4567-e89b-12d3-a456-426614174000",
 *   "name": "Room 1",
 *   "createdAt": "2021-01-01T00:00:00.000Z"
 * }
 */
@ApiSchema({
  name: 'RoomSchema',
  description: 'The schema for the room entity',
})
export class RoomApiSchema {
  /**
   * Unique identifier for the room.
   *
   * @type {string}
   * @description UUID format identifier for the room entity.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @ApiProperty({
    description: 'The ID of the room',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  /**
   * Name of the room.
   *
   * @type {string}
   * @description Human-readable name for the room.
   * @example "Room 1"
   */
  @ApiProperty({
    description: 'The name of the room',
    example: 'Room 1',
  })
  name: string;

  /**
   * Timestamp when the room was created.
   *
   * @type {Date}
   * @description ISO 8601 formatted date-time string indicating creation time.
   * @example "2021-01-01T00:00:00.000Z"
   */
  @ApiProperty({
    description: 'The created at timestamp of the room',
  })
  createdAt: Date;
}
