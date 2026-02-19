/**
 * @fileoverview Swagger API schema definition for the Movie entity.
 *
 * @description
 * This file contains the MovieApiSchema class which defines the OpenAPI/Swagger
 * documentation schema for movie entities, used for API documentation generation.
 *
 * @module movie.api-schema
 */

import { ApiProperty, ApiSchema } from '@nestjs/swagger';

/**
 * Swagger API schema class representing a movie entity in API documentation.
 *
 * @description
 * Defines the structure and documentation for movie objects returned by the API.
 * This schema is used by Swagger/OpenAPI to generate accurate API documentation
 * with property descriptions and example values.
 *
 * @class MovieApiSchema
 * @decorator ApiSchema - Configures the schema name and description for Swagger documentation.
 *
 * @example
 * ```typescript
 * // Example response object matching this schema:
 * {
 *   id: '123e4567-e89b-12d3-a456-426614174000',
 *   name: 'Inception',
 *   description: 'A mind-bending thriller about dream infiltration',
 *   createdAt: '2024-01-15T10:30:00.000Z',
 *   updatedAt: '2024-01-15T10:30:00.000Z'
 * }
 * ```
 */
@ApiSchema({
  name: 'MovieSchema',
  description: 'The schema for the movie entity',
})
export class MovieApiSchema {
  /**
   * The unique identifier of the movie.
   *
   * @type {string}
   * @description UUID v4 format identifier for the movie entity.
   */
  @ApiProperty({
    description: 'The ID of the movie',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  /**
   * The name/title of the movie.
   *
   * @type {string}
   * @description The display name of the movie, limited to 128 characters.
   */
  @ApiProperty({
    description: 'The name of the movie',
    example: 'Inception',
  })
  name: string;

  /**
   * The description of the movie.
   *
   * @type {string}
   * @description A brief summary or synopsis of the movie, limited to 255 characters.
   */
  @ApiProperty({
    description: 'The description of the movie',
    example: 'A mind-bending thriller about dream infiltration',
  })
  description: string;

  /**
   * The timestamp when the movie record was created.
   *
   * @type {Date}
   * @description ISO 8601 formatted timestamp indicating when the movie was added to the database.
   */
  @ApiProperty({
    description: 'The created at timestamp of the movie',
  })
  createdAt: Date;

  /**
   * The timestamp when the movie record was last updated.
   *
   * @type {Date}
   * @description ISO 8601 formatted timestamp indicating the last modification time.
   */
  @ApiProperty({
    description: 'The updated at timestamp of the movie',
  })
  updatedAt: Date;
}
