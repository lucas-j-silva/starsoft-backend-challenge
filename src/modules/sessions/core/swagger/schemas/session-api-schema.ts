/**
 * @fileoverview Swagger API schema definitions for session entities.
 *
 * @description
 * This file contains the Swagger/OpenAPI schema definitions for session-related
 * API responses, including the session entity schema and paginated results schema.
 *
 * @module session-api-schema
 */

import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PaginationMetadataDto } from 'src/shared/dtos/pagination-metadata.dto';

/**
 * Swagger API schema for session entity responses.
 *
 * @description
 * Defines the structure of session data returned by API endpoints.
 * Used for OpenAPI documentation generation.
 *
 * @class SessionApiSchema
 *
 * @example
 * // Example API response
 * {
 *   "id": "123e4567-e89b-12d3-a456-426614174000",
 *   "movieId": "123e4567-e89b-12d3-a456-426614174000",
 *   "roomId": "123e4567-e89b-12d3-a456-426614174000",
 *   "valuePerSeatInCents": 1000,
 *   "startTime": "2021-01-01T00:00:00.000Z",
 *   "createdAt": "2021-01-01T00:00:00.000Z",
 *   "updatedAt": "2021-01-01T00:00:00.000Z"
 * }
 */
export class SessionApiSchema {
  /**
   * Unique identifier for the session.
   * @type {string}
   */
  @ApiProperty({
    description: 'The ID of the session',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  /**
   * Foreign key reference to the associated movie.
   * @type {string}
   */
  @ApiProperty({
    description: 'The movie of the session',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  movieId: string;

  /**
   * Foreign key reference to the associated room.
   * @type {string}
   */
  @ApiProperty({
    description: 'The room of the session',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  roomId: string;

  /**
   * Price per seat in cents for the session.
   * @type {number}
   */
  @ApiProperty({
    description: 'The value per seat in cents of the session',
    example: 1000,
  })
  valuePerSeatInCents: number;

  /**
   * Scheduled start time of the session.
   * @type {Date}
   */
  @ApiProperty({
    description: 'The start time of the session',
    example: '2021-01-01T00:00:00.000Z',
  })
  startTime: Date;

  /**
   * Timestamp when the session was created.
   * @type {Date}
   */
  @ApiProperty({
    description: 'The created at timestamp of the session',
  })
  createdAt: Date;

  /**
   * Timestamp when the session was last updated.
   * @type {Date}
   */
  @ApiProperty({
    description: 'The updated at timestamp of the session',
  })
  updatedAt: Date;
}

/**
 * Swagger API schema for paginated session results.
 *
 * @description
 * Defines the structure of paginated session data returned by list endpoints.
 * Contains an array of session entities and pagination metadata.
 *
 * @class SessionsPaginationResultApiSchema
 *
 * @example
 * // Example paginated API response
 * {
 *   "data": [
 *     {
 *       "id": "123e4567-e89b-12d3-a456-426614174000",
 *       "movieId": "123e4567-e89b-12d3-a456-426614174000",
 *       "roomId": "123e4567-e89b-12d3-a456-426614174000",
 *       "valuePerSeatInCents": 1000,
 *       "startTime": "2021-01-01T00:00:00.000Z",
 *       "createdAt": "2021-01-01T00:00:00.000Z",
 *       "updatedAt": "2021-01-01T00:00:00.000Z"
 *     }
 *   ],
 *   "metadata": {
 *     "currentPage": 1,
 *     "totalPages": 5,
 *     "limit": 10
 *   }
 * }
 */
@ApiSchema({
  name: 'SessionApiPaginationResultSchema',
  description: 'The schema for the session entity',
})
export class SessionsPaginationResultApiSchema {
  /**
   * Array of session entities for the current page.
   * @type {SessionApiSchema[]}
   */
  @ApiProperty({
    description: 'The data of the pagination result',
    type: [SessionApiSchema],
  })
  data: SessionApiSchema[];

  /**
   * Pagination metadata including current page, total pages, and limit.
   * @type {PaginationMetadataDto}
   */
  @ApiProperty({
    description: 'The metadata of the pagination result',
    type: PaginationMetadataDto,
  })
  metadata: PaginationMetadataDto;
}
