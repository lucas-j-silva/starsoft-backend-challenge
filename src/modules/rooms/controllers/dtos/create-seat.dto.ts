/**
 * @fileoverview Data Transfer Object for seat creation request body.
 *
 * @description
 * This file contains the DTO class used to validate the request body
 * when creating a new seat via the API. It picks only the necessary
 * fields from the base CreateSeatDto, excluding roomId which is
 * provided via URL parameters.
 *
 * @module create-seat-body.dto
 */

import { PickType, ApiSchema } from '@nestjs/swagger';
import { CreateSeatDto } from '../../dtos';
/**
 * Data Transfer Object for the seat creation request body.
 *
 * @description
 * Extends a subset of CreateSeatDto, picking only 'row' and 'column' fields.
 * The roomId is excluded as it is provided via the URL path parameter.
 *
 * @class CreateSeatBodyDto
 * @extends {PickType<CreateSeatDto, 'row' | 'column'>}
 *
 * @example
 * // Request body for creating seat A12
 * {
 *   "row": "A",
 *   "column": 12
 * }
 */
@ApiSchema({
  name: 'CreateSeatBodyDto',
  description: 'Data Transfer Object for the seat creation request body',
})
export class CreateSeatBodyDto extends PickType(CreateSeatDto, [
  'row',
  'column',
]) {}
