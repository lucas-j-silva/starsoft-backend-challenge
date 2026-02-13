/**
 * @fileoverview Data Transfer Object for listing rooms with pagination.
 *
 * @description
 * This DTO extends the base PaginationDto to provide pagination parameters
 * specifically for room listing operations.
 *
 * @module list-rooms-with-pagination.dto
 */

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
