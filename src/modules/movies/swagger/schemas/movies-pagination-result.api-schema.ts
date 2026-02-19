/**
 * @fileoverview Swagger API schema definition for paginated movie results.
 *
 * @description
 * This file contains the MoviesPaginationResultApiSchema class which defines the OpenAPI/Swagger
 * documentation schema for paginated movie responses, used for API documentation generation.
 *
 * @module movies-pagination-result.api-schema
 */

import { MovieApiSchema } from './movie.api-schema';
import { PaginationMetadataDto } from '../../../../shared/dtos/pagination-metadata.dto';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

/**
 * Swagger API schema class representing a paginated result of movie entities in API documentation.
 *
 * @description
 * Defines the structure and documentation for paginated movie responses returned by the API.
 * This schema is used by Swagger/OpenAPI to generate accurate API documentation
 * with property descriptions for both the data array and pagination metadata.
 *
 * @class MoviesPaginationResultApiSchema
 * @decorator ApiSchema - Configures the schema name and description for Swagger documentation.
 *
 * @example
 * ```typescript
 * // Example response object matching this schema:
 * {
 *   data: [
 *     {
 *       id: '123e4567-e89b-12d3-a456-426614174000',
 *       name: 'Inception',
 *       description: 'A mind-bending thriller about dream infiltration',
 *       createdAt: '2024-01-15T10:30:00.000Z',
 *       updatedAt: '2024-01-15T10:30:00.000Z'
 *     }
 *   ],
 *   metadata: {
 *     currentPage: 1,
 *     totalPages: 5,
 *     limit: 10
 *   }
 * }
 * ```
 */
@ApiSchema({
  name: 'MoviesPaginationResultApiSchema',
  description: 'The schema for the pagination result of movies',
})
export class MoviesPaginationResultApiSchema {
  /**
   * The array of movie entities for the current page.
   *
   * @type {MovieApiSchema[]}
   * @description Contains the list of movies returned for the requested page.
   */
  @ApiProperty({
    description: 'The data of the pagination result',
    type: [MovieApiSchema],
  })
  data: MovieApiSchema[];

  /**
   * The pagination metadata for the result set.
   *
   * @type {PaginationMetadataDto}
   * @description Contains information about the current page, total pages, and items per page.
   */
  @ApiProperty({
    description: 'The metadata of the pagination result',
    type: PaginationMetadataDto,
  })
  metadata: PaginationMetadataDto;
}
