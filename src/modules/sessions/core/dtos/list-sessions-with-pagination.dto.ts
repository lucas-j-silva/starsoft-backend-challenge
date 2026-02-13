/**
 * @fileoverview Data Transfer Object for listing sessions with pagination.
 *
 * @description
 * This file contains the DTO class used to handle pagination parameters
 * when listing cinema sessions. It extends the base PaginationDto to
 * inherit standard pagination functionality.
 *
 * @module list-sessions-with-pagination.dto
 */

import { PaginationDto } from '../../../../shared/dtos/pagination.dto';

/**
 * Data Transfer Object for listing sessions with pagination support.
 *
 * @description
 * This DTO extends the base PaginationDto to provide pagination
 * capabilities when querying cinema sessions. It inherits all
 * pagination properties such as page number and page size.
 *
 * @class ListSessionsWithPaginationDto
 * @extends {PaginationDto}
 *
 * @example
 * // Example usage in a controller
 * const paginationDto: ListSessionsWithPaginationDto = {
 *   page: 1,
 *   limit: 10,
 * };
 */
export class ListSessionsWithPaginationDto extends PaginationDto {}
