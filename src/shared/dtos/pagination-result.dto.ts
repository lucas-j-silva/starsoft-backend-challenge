/**
 * @fileoverview Data Transfer Object for paginated results.
 *
 * @description
 * This DTO defines the structure for paginated response data.
 * Used to wrap collection results with pagination metadata across the application.
 *
 * @module pagination-result.dto
 */

import { PaginationMetadataDto } from './pagination-metadata.dto';

/**
 * Generic Data Transfer Object for paginated results.
 *
 * @description This DTO wraps paginated data with associated metadata.
 * It provides a consistent structure for all paginated responses in the application.
 *
 * @template T - The type of items contained in the paginated result.
 *
 * @example
 * // Creating a paginated result for users
 * const result = new PaginationResultDto<User>({
 *   data: [user1, user2, user3],
 *   metadata: { total: 100, page: 1, limit: 10 }
 * });
 *
 * @example
 * // Accessing paginated data
 * console.log(result.data); // Array of items
 * console.log(result.metadata.total); // Total count
 */
export class PaginationResultDto<T> {
  /**
   * The array of items for the current page.
   *
   * @type {T[]}
   * @description Contains the paginated subset of items.
   */
  data: T[];

  /**
   * The pagination metadata for the result.
   *
   * @type {PaginationMetadataDto}
   * @description Contains information about total count, current page, and limit.
   */
  metadata: PaginationMetadataDto;

  /**
   * Creates an instance of PaginationResultDto.
   *
   * @param {Partial<PaginationResultDto<T>>} data - Partial object containing data and metadata properties.
   *
   * @example
   * const result = new PaginationResultDto<Room>({
   *   data: rooms,
   *   metadata: { total: 50, page: 2, limit: 10 }
   * });
   */
  constructor(data: Partial<PaginationResultDto<T>>) {
    Object.assign(this, data);
  }
}
