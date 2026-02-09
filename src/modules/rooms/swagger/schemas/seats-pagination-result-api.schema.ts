import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { SeatApiSchema } from './seat-api.schema';
import { PaginationMetadataDto } from 'src/shared/dtos/pagination-metadata.dto';

/**
 * Swagger API schema representing a paginated result of seat entities.
 *
 * @description
 * Defines the structure and documentation for paginated seat responses in the API.
 * Used by Swagger to generate accurate API documentation with examples.
 *
 * @class SeatsPaginationResultApiSchema
 *
 * @example
 * // Example paginated seats response
 * {
 *   "data": [
 *     {
 *       "id": "123e4567-e89b-12d3-a456-426614174000",
 *       "row": "A",
 *       "column": 12,
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
  name: 'SeatsPaginationResultApiSchema',
  description: 'The schema for the pagination result of seats',
})
export class SeatsPaginationResultApiSchema {
  /**
   * Array of seat entities in the current page.
   *
   * @type {SeatApiSchema[]}
   * @description Contains the list of seat objects for the requested page.
   */
  @ApiProperty({
    description: 'The data of the pagination result',
    type: [SeatApiSchema],
  })
  data: SeatApiSchema[];

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
