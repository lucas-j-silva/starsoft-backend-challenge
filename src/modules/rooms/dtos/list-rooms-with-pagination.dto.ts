/**
 * @fileoverview Data Transfer Object for listing rooms with pagination.
 *
 * @description
 * This DTO extends the base PaginationDto to provide pagination parameters
 * specifically for room listing operations.
 *
 * @module list-rooms-with-pagination.dto
 */

import { PickType } from '@nestjs/swagger';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';

/**
 * Data Transfer Object for listing rooms with pagination support.
 *
 * @description This DTO inherits all pagination properties from PaginationDto,
 * including page number and limit parameters. Used to validate and structure
 * pagination requests for room listing endpoints.
 *
 * @extends {PaginationDto}
 *
 * @example
 * // Creating a DTO for paginated room listing
 * const dto = new ListRoomsWithPaginationDto({ page: 1, limit: 10 });
 */
export class ListRoomsWithPaginationDto extends PaginationDto {}

/**
 * Data Transfer Object for seat listing pagination query parameters.
 *
 * @description
 * Extends a subset of ListRoomsWithPaginationDto, picking only 'page' and 'limit' fields.
 * Used to validate and parse query parameters for paginated seat listings.
 *
 * @class ListSeatsWithPaginationQueryDto
 * @extends {PickType<ListRoomsWithPaginationDto, 'page' | 'limit'>}
 *
 * @example
 * // Query parameters for listing seats with pagination
 * // GET /rooms/:roomId/seats?page=1&limit=10
 * {
 *   "page": 1,
 *   "limit": 10
 * }
 */
export class ListSeatsWithPaginationQueryDto extends PickType(
  ListRoomsWithPaginationDto,
  ['page', 'limit'],
) {}
