/**
 * @fileoverview Data Transfer Object for updating cinema sessions.
 *
 * @description
 * This file contains the DTO class used to validate and transfer data
 * when updating existing cinema sessions. It includes validation decorators
 * from class-validator to ensure data integrity.
 *
 * @module update-session.dto
 */

import { PickType } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

/**
 * Data Transfer Object for updating an existing cinema session.
 *
 * @description
 * This DTO defines the structure and validation rules for updating
 * a cinema session. The session ID is required, while other fields
 * are optional and will only update if provided.
 *
 * @class UpdateSessionDto
 *
 * @example
 * // Example usage - updating session price
 * const updateDto = new UpdateSessionDto({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   valuePerSeatInCents: 2500,
 * });
 *
 * @example
 * // Example usage - updating session start time
 * const updateDto = new UpdateSessionDto({
 *   id: '550e8400-e29b-41d4-a716-446655440000',
 *   startTime: new Date('2024-12-25T19:00:00'),
 * });
 */
export class UpdateSessionDto {
  /**
   * The unique identifier of the session to update.
   *
   * @type {string}
   * @memberof UpdateSessionDto
   * @required
   * @description Must be a valid UUID format.
   */
  @IsNotEmpty()
  @IsUUID()
  id: string;

  /**
   * The price per seat in cents (optional).
   *
   * @type {number}
   * @memberof UpdateSessionDto
   * @optional
   * @description The ticket price stored in cents to avoid floating point issues.
   * @example 2500 // Represents $25.00
   */
  @IsOptional()
  @IsNumber()
  valuePerSeatInCents?: number;

  /**
   * The session start time (optional).
   *
   * @type {Date}
   * @memberof UpdateSessionDto
   * @optional
   * @description The date and time when the cinema session begins.
   */
  @IsOptional()
  @IsDate()
  startTime?: Date;

  /**
   * Creates an instance of UpdateSessionDto.
   *
   * @constructor
   * @param {Partial<UpdateSessionDto>} data - Partial data to initialize the DTO.
   * @description Assigns provided data properties to the instance using Object.assign.
   */
  constructor(data: Partial<UpdateSessionDto>) {
    Object.assign(this, data);
  }
}

/**
 * DTO for the request body when updating a session.
 *
 * @description
 * Picks only the `valuePerSeatInCents` and `startTime` fields from the
 * base `UpdateSessionDto`, excluding the `id` which is typically provided
 * as a route parameter.
 *
 * @extends {PickType<UpdateSessionDto, 'valuePerSeatInCents' | 'startTime'>}
 *
 * @example
 * // Example request body
 * const body: UpdateSessionBodyDto = {
 *   valuePerSeatInCents: 2500,
 *   startTime: new Date('2024-12-25T19:00:00'),
 * };
 */
export class UpdateSessionBodyDto extends PickType(UpdateSessionDto, [
  'valuePerSeatInCents',
  'startTime',
]) {}
