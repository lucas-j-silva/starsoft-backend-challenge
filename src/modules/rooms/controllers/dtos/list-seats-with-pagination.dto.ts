/**
 * @fileoverview Data Transfer Object for seat listing pagination query parameters.
 *
 * @description
 * This file contains the DTO class used to validate query parameters
 * when listing seats with pagination via the API. It picks only the
 * pagination-related fields from the base ListRoomsWithPaginationDto.
 *
 * @module list-seats-with-pagination.dto
 */

import { PickType } from '@nestjs/mapped-types';
import { ListRoomsWithPaginationDto } from '../../dtos';

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
