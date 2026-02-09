/**
 * @fileoverview Data Transfer Object for pagination metadata.
 *
 * @description
 * This file contains the PaginationMetadataDto class which represents
 * the metadata information returned with paginated API responses.
 *
 * @module pagination-metadata.dto
 */

import { ApiProperty, ApiSchema } from '@nestjs/swagger';

/**
 * Data Transfer Object representing pagination metadata.
 *
 * @description
 * This DTO encapsulates pagination information that accompanies paginated
 * API responses. It provides details about the current page, total available
 * pages, and the number of items per page.
 *
 * @class PaginationMetadataDto
 * @decorator ApiSchema - Configures Swagger/OpenAPI schema metadata.
 *
 * @example
 * // Example metadata in a paginated response:
 * // { currentPage: 1, totalPages: 10, limit: 20 }
 */
@ApiSchema({
  name: 'PaginationMetadataDto',
  description: 'The schema for the pagination metadata',
})
export class PaginationMetadataDto {
  /**
   * The current page number in the paginated result set.
   *
   * @type {number}
   * @example 1
   */
  @ApiProperty({
    description: 'The current page',
    example: 1,
  })
  currentPage: number;

  /**
   * The total number of pages available based on the limit and total items.
   *
   * @type {number}
   * @example 10
   */
  @ApiProperty({
    description: 'The total pages',
    example: 10,
  })
  totalPages: number;

  /**
   * The maximum number of items returned per page.
   *
   * @type {number}
   * @example 10
   */
  @ApiProperty({
    description: 'The limit',
    example: 10,
  })
  limit: number;
}
