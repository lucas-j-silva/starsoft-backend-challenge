/**
 * @fileoverview Swagger API schema for seat entity.
 *
 * @description
 * This file defines the API schema used for Swagger documentation
 * of seat-related endpoints. It provides type definitions and examples
 * for the seat entity response structure.
 *
 * @module seat-api.schema
 */

import { ApiProperty, ApiSchema } from '@nestjs/swagger';

/**
 * Swagger API schema representing a seat entity.
 *
 * @description
 * Defines the structure and documentation for seat responses in the API.
 * Used by Swagger to generate accurate API documentation with examples.
 *
 * @class SeatApiSchema
 *
 * @example
 * // Example seat response
 * {
 *   "id": "123e4567-e89b-12d3-a456-426614174000",
 *   "row": "A",
 *   "column": 12,
 *   "createdAt": "2021-01-01T00:00:00.000Z"
 * }
 */
@ApiSchema({
  name: 'SeatApiSchema',
  description: 'The schema for the seat entity',
})
export class SeatApiSchema {
  /**
   * Unique identifier for the seat.
   *
   * @type {string}
   * @description UUID format identifier for the seat entity.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @ApiProperty({
    description: 'The ID of the seat',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  /**
   * Row identifier for the seat.
   *
   * @type {string}
   * @description Alphabetical row designation (e.g., "A", "B", "C").
   * @example "A"
   */
  @ApiProperty({
    description: 'The row of the seat',
    example: 'A',
  })
  row: string;

  /**
   * Column number for the seat.
   *
   * @type {number}
   * @description Numeric column position within the row.
   * @example 12
   */
  @ApiProperty({
    description: 'The column of the seat',
    example: 12,
  })
  column: number;

  /**
   * Timestamp when the seat was created.
   *
   * @type {Date}
   * @description ISO 8601 formatted date-time string indicating creation time.
   * @example "2021-01-01T00:00:00.000Z"
   */
  @ApiProperty({
    description: 'The created at timestamp of the seat',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
