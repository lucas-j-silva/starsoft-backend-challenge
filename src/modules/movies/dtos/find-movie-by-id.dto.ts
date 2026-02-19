/**
 * @fileoverview Data Transfer Object for finding a movie by its unique identifier.
 *
 * @description
 * This file contains the DTO class used to validate and transfer data
 * when finding a movie by its unique identifier. It includes validation decorators
 * from class-validator to ensure data integrity.
 *
 * @module find-movie-by-id.dto
 */

import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for finding a movie by its unique identifier.
 * Used to validate the incoming request parameters when retrieving a specific movie.
 *
 * @class FindMovieByIdDto
 *
 * @example
 * const dto = new FindMovieByIdDto({ id: '550e8400-e29b-41d4-a716-446655440000' });
 */
export class FindMovieByIdDto {
  /**
   * The unique identifier of the movie to find.
   * Must be a valid UUID format and cannot be empty.
   *
   * @type {string}
   * @memberof FindMovieByIdDto
   *
   * @example
   * '550e8400-e29b-41d4-a716-446655440000'
   */
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  id: string;

  /**
   * Creates a new instance of FindMovieByIdDto.
   *
   * @param {Partial<FindMovieByIdDto>} data - The data to create the instance from
   */
  constructor(data: Partial<FindMovieByIdDto>) {
    Object.assign(this, data);
  }
}
