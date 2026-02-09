/**
 * @fileoverview Data Transfer Object for pagination parameters.
 *
 * @description
 * This DTO defines the validation rules and structure for pagination requests.
 * Used to validate incoming pagination data across the application.
 *
 * @module pagination.dto
 */

import { IsInt, IsNotEmpty, IsOptional, Max, Min } from 'class-validator';

/**
 * Data Transfer Object for pagination parameters.
 *
 * @description This DTO validates pagination input for list/collection endpoints.
 * It ensures the provided limit and page values are valid integers within acceptable ranges.
 *
 * @example
 * // Valid usage with both parameters
 * const dto = new PaginationDto();
 * dto.limit = 10;
 * dto.page = 1;
 *
 * @example
 * // Valid usage with only required parameter
 * const dto = new PaginationDto();
 * dto.page = 2;
 */
export class PaginationDto {
  /**
   * The maximum number of items to return per page.
   *
   * @type {number}
   * @description Optional parameter that limits the number of results.
   * Must be an integer between 1 and 100 (inclusive).
   * @example 10
   */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  /**
   * The page number to retrieve.
   *
   * @type {number}
   * @description Required parameter indicating which page of results to return.
   * Must be a non-empty integer with a minimum value of 1.
   * @example 1
   */
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  page: number;
}
