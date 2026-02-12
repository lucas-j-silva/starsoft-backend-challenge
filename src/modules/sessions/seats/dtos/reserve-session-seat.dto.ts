/**
 * @fileoverview Data Transfer Object for reserving a session seat.
 *
 * @description
 * This file contains the ReserveSessionSeatDto class which is used to validate and transfer
 * the required parameters for reserving a session seat.
 *
 * @module reserve-session-seat.dto
 */

import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for reserving a session seat.
 *
 * @description
 * This DTO is used to validate and transfer the required parameters
 * for reserving a session seat.
 *
 * @class ReserveSessionSeatDto
 *
 * @example
 * const reserveSeatDto = new ReserveSessionSeatDto({
 *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440000',
 *   userId: '550e8400-e29b-41d4-a716-446655440000',
 *   sessionId: '550e8400-e29b-41d4-a716-446655440000',
 * });
 */
export class ReserveSessionSeatDto {
  /**
   * The unique identifier of the session seat to reserve.
   *
   * @type {string}
   * @memberof ReserveSessionSeatDto
   * @example '550e8400-e29b-41d4-a716-446655440000'
   */
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  sessionSeatId: string;

  /**
   * The unique identifier of the user reserving the session seat.
   *
   * @type {string}
   * @memberof ReserveSessionSeatDto
   * @example '550e8400-e29b-41d4-a716-446655440000'
   */
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  userId: string;

  /**
   * The unique identifier of the session to reserve the seat for.
   *
   * @type {string}
   * @memberof ReserveSessionSeatDto
   * @example '550e8400-e29b-41d4-a716-446655440000'
   */
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  sessionId: string;

  /**
   * Creates an instance of ReserveSessionSeatDto.
   *
   * @param {Partial<ReserveSessionSeatDto>} data - Partial data to initialize the DTO.
   */
  constructor(data: Partial<ReserveSessionSeatDto>) {
    Object.assign(this, data);
  }
}
