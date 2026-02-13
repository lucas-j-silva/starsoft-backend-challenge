/**
 * @fileoverview Swagger API schema for paginated room results.
 *
 * @description
 * This file defines the API schema used for Swagger documentation
 * of paginated room list endpoints. It provides type definitions and examples
 * for the pagination result structure containing room entities.
 *
 * @module rooms-pagination-result-api.schema
 */

import { RoomApiSchema } from './room-api.schema';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PaginationMetadataDto } from '../../../../shared/dtos/pagination-metadata.dto';

/**
 * Swagger API schema representing a paginated result of room entities.
 *
 * @description
 * Defines the structure and documentation for paginated room responses in the API.
 * Used by Swagger to generate accurate API documentation with examples.
 *
 * @class RoomsPaginationResultApiSchema
 *
 * @example
 * // Example paginated rooms response
 * {
 *   "data": [
 *     {
 *       "id": "123e4567-e89b-12d3-a456-426614174000",
 *       "name": "Room 1",
 *       "createdAt": "2021-01-01T00:00:00.000Z"
 *     }
 *   ],
 *   "metadata": {
 *     "total": 100,
 *     "page": 1,
 *     "limit": 10,
 *     "totalPages": 10
 *   }
 * }
 */
@ApiSchema({
  name: 'RoomsPaginationResultApiSchema',
  description: 'The schema for the pagination result of rooms',
})
export class RoomsPaginationResultApiSchema {
  /**
   * Array of room entities in the current page.
   *
   * @type {RoomApiSchema[]}
   * @description Contains the list of room objects for the requested page.
   */
  @ApiProperty({
    description: 'The data of the pagination result',
    type: [RoomApiSchema],
  })
  data: RoomApiSchema[];

  /**
   * Pagination metadata information.
   *
   * @type {PaginationMetadataDto}
   * @description Contains pagination details such as total count, current page, limit, and total pages.
   */
  @ApiProperty({
    description: 'The metadata of the pagination result',
    type: PaginationMetadataDto,
  })
  metadata: PaginationMetadataDto;
}
