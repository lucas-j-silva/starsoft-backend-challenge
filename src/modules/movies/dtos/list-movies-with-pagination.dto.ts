/**
 * @fileoverview Data Transfer Object for listing movies with pagination.
 *
 * @description
 * This file contains the DTO class used to validate and transfer pagination
 * parameters when listing movies. It extends the base PaginationDto to inherit
 * standard pagination functionality.
 *
 * @module list-movies-with-pagination.dto
 */

import { PaginationDto } from '../../../shared/dtos/pagination.dto';

/**
 * Data Transfer Object for listing movies with pagination support.
 * Extends the base PaginationDto to provide pagination parameters for movie listings.
 *
 * @class ListMoviesWithPaginationDto
 * @extends {PaginationDto}
 *
 * @example
 * const dto = new ListMoviesWithPaginationDto({
 *   page: 1,
 *   limit: 10,
 * });
 */
export class ListMoviesWithPaginationDto extends PaginationDto {}
