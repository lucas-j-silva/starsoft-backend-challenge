/**
 * @fileoverview Swagger API schema for session seat reservation entity.
 *
 * @description
 * This file contains the API schema class used for Swagger documentation
 * of the session seat reservation entity. It defines the structure and
 * metadata for API responses related to seat reservations.
 *
 * @module session-seat-reservation.api-schema
 */

import { ApiProperty, ApiSchema } from '@nestjs/swagger';

/**
 * API schema for session seat reservation entity.
 *
 * @description
 * Defines the Swagger documentation schema for session seat reservations.
 * Used to document API responses that include reservation data such as
 * user information, expiration times, and confirmation status.
 *
 * @class SessionSeatReservationApiSchema
 *
 * @example
 * // Example API response structure
 * {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440000',
 *   expiresAt: '2021-01-01T00:00:00.000Z',
 *   confirmedAt: '2021-01-01T00:00:00.000Z',
 *   createdAt: '2021-01-01T00:00:00.000Z'
 * }
 */
@ApiSchema({
  name: 'SessionSeatReservationApiSchema',
  description: 'The schema for the session seat reservation entity',
})
export class SessionSeatReservationApiSchema {
  /**
   * The unique identifier of the session seat reservation.
   *
   * @type {string}
   * @memberof SessionSeatReservationApiSchema
   */
  @ApiProperty({
    description: 'The ID of the session seat reservation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  /**
   * The unique identifier of the user who made the reservation.
   *
   * @type {string}
   * @memberof SessionSeatReservationApiSchema
   */
  @ApiProperty({
    description: 'The user ID of the session seat reservation',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  /**
   * The unique identifier of the session seat being reserved.
   *
   * @type {string}
   * @memberof SessionSeatReservationApiSchema
   */
  @ApiProperty({
    description: 'The session seat ID of the session seat reservation',
  })
  sessionSeatId: string;

  /**
   * The timestamp when the reservation expires if not confirmed.
   *
   * @type {Date}
   * @memberof SessionSeatReservationApiSchema
   */
  @ApiProperty({
    description: 'The expires at of the session seat reservation',
    example: '2021-01-01T00:00:00.000Z',
  })
  expiresAt: Date;

  /**
   * The timestamp when the reservation was confirmed.
   *
   * @type {Date}
   * @memberof SessionSeatReservationApiSchema
   */
  @ApiProperty({
    description: 'The confirmed at of the session seat reservation',
    example: '2021-01-01T00:00:00.000Z',
  })
  confirmedAt: Date;

  /**
   * The timestamp when the reservation was created.
   *
   * @type {Date}
   * @memberof SessionSeatReservationApiSchema
   */
  @ApiProperty({
    description: 'The created at of the session seat reservation',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
