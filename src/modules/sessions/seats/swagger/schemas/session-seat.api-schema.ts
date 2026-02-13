/**
 * @fileoverview Swagger API schema for session seat entity.
 *
 * @description
 * This file contains the API schema classes used for Swagger documentation
 * of the session seat entity. It defines the structure and metadata for
 * API responses related to session seats and their relations.
 *
 * @module session-seat.api-schema
 */

import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { SessionApiSchema } from '../../../core/swagger/schemas/session.api-schema';

/**
 * API schema for session seat entity.
 *
 * @description
 * Defines the Swagger documentation schema for session seats.
 * Used to document API responses that include session seat data such as
 * seat identification, availability status, and timestamps.
 *
 * @class SessionSeatApiSchema
 *
 * @example
 * // Example API response structure
 * {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   seatId: '123e4567-e89b-12d3-a456-426614174000',
 *   sessionId: '550e8400-e29b-41d4-a716-446655440000',
 *   isAvailable: true,
 *   soldAt: '2021-01-01T00:00:00.000Z',
 *   createdAt: '2021-01-01T00:00:00.000Z'
 * }
 */
export class SessionSeatApiSchema {
  /**
   * The unique identifier of the session seat.
   *
   * @type {string}
   * @memberof SessionSeatApiSchema
   */
  @ApiProperty({
    description: 'The ID of the session seat',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  /**
   * The unique identifier of the seat associated with this session seat.
   *
   * @type {string}
   * @memberof SessionSeatApiSchema
   */
  @ApiProperty({
    description: 'The seat of the session seat',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  seatId: string;

  /**
   * The unique identifier of the session this seat belongs to.
   *
   * @type {string}
   * @memberof SessionSeatApiSchema
   */
  @ApiProperty({
    description: 'The session of the session seat',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  sessionId: string;

  /**
   * Indicates whether the session seat is available for booking.
   *
   * @type {boolean}
   * @memberof SessionSeatApiSchema
   */
  @ApiProperty({
    description: 'The is available of the session seat',
    example: true,
  })
  isAvailable: boolean;

  /**
   * The timestamp when the session seat was sold.
   *
   * @type {Date}
   * @memberof SessionSeatApiSchema
   */
  @ApiProperty({
    description: 'The sold at of the session seat',
    example: '2021-01-01T00:00:00.000Z',
  })
  soldAt: Date;

  /**
   * The timestamp when the session seat record was created.
   *
   * @type {Date}
   * @memberof SessionSeatApiSchema
   */
  @ApiProperty({
    description: 'The created at of the session seat',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}

/**
 * API schema for session seat relations.
 *
 * @description
 * Defines the Swagger documentation schema for session seat relations.
 * Used to document nested relation objects within session seat responses.
 *
 * @class SessionSeatRelationsApiSchema
 */
@ApiSchema({
  name: 'SessionSeatRelationsApiSchema',
  description: 'The schema for the session seat relations',
})
class SessionSeatRelationsApiSchema {
  /**
   * The seat entity related to this session seat.
   *
   * @type {SessionSeatApiSchema}
   * @memberof SessionSeatRelationsApiSchema
   * @optional
   */
  @ApiProperty({
    description: 'The seat of the session seat',
    type: SessionSeatApiSchema,
  })
  seat?: SessionSeatApiSchema;

  /**
   * The session entity related to this session seat.
   *
   * @type {SessionApiSchema}
   * @memberof SessionSeatRelationsApiSchema
   * @optional
   */
  @ApiProperty({
    description: 'The session of the session seat',
    type: SessionApiSchema,
    example: {},
  })
  session?: SessionApiSchema;
}

/**
 * API schema for session seat entity with relations.
 *
 * @description
 * Extends the base SessionSeatApiSchema to include relation data.
 * Used to document API responses that include session seat data
 * along with related seat and session entities.
 *
 * @class SessionSeatWithRelationsApiSchema
 * @extends {SessionSeatApiSchema}
 *
 * @example
 * // Example API response structure with relations
 * {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   seatId: '123e4567-e89b-12d3-a456-426614174000',
 *   sessionId: '550e8400-e29b-41d4-a716-446655440000',
 *   isAvailable: true,
 *   soldAt: '2021-01-01T00:00:00.000Z',
 *   createdAt: '2021-01-01T00:00:00.000Z',
 *   relations: {
 *     seat: { ... },
 *     session: { ... }
 *   }
 * }
 */
@ApiSchema({
  name: 'SessionSeatWithRelationsApiSchema',
  description: 'The schema for the session seat entity with relations',
})
export class SessionSeatWithRelationsApiSchema extends SessionSeatApiSchema {
  /**
   * The relations associated with this session seat.
   *
   * @type {SessionSeatRelationsApiSchema}
   * @memberof SessionSeatWithRelationsApiSchema
   * @optional
   */
  @ApiProperty({
    description: 'The relations of the session seat',
  })
  relations?: SessionSeatRelationsApiSchema;
}
