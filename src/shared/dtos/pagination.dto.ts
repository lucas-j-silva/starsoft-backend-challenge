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
  @IsOptional({ message: 'validation.IS_OPTIONAL' })
  @IsInt({ message: 'validation.IS_INT' })
  @Min(1, { message: 'validation.MIN' })
  @Max(100, { message: 'validation.MAX' })
  limit?: number;

  /**
   * The page number to retrieve.
   *
   * @type {number}
   * @description Required parameter indicating which page of results to return.
   * Must be a non-empty integer with a minimum value of 1.
   * @example 1
   */
  @IsInt({ message: 'validation.IS_INT' })
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @Min(1, { message: 'validation.MIN' })
  page: number;
}
