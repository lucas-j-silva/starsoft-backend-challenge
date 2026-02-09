/**
 * @fileoverview Data Transfer Object for creating a new room.
 *
 * @description
 * This DTO defines the validation rules and structure for room creation requests.
 * Used to validate incoming data when creating new cinema rooms.
 *
 * @module create-room.dto
 */

import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, IsString } from 'class-validator';

/**
 * Data Transfer Object for creating a new room.
 *
 * @description
 * Validates and transfers data required to create a new cinema room.
 * Ensures the room name meets all validation requirements before processing.
 *
 * @example
 * // Creating a new room DTO
 * const createRoomDto = new CreateRoomDto({ name: 'IMAX Theater' });
 */
@ApiSchema({
  name: 'CreateRoomDto',
  description: 'Data Transfer Object for creating a new room',
})
export class CreateRoomDto {
  /**
   * Display name for the room.
   *
   * @type {string}
   * @description Must be a non-empty string with a maximum length of 128 characters.
   * @example "Room 1", "IMAX Theater", "VIP Room"
   */
  @ApiProperty({
    description: 'The name of the room',
    example: 'IMAX Theater',
    maxLength: 128,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  name: string;

  /**
   * Creates an instance of CreateRoomDto.
   *
   * @param {Partial<CreateRoomDto>} data - Partial data to initialize the DTO.
   * @example
   * const dto = new CreateRoomDto({ name: 'Room 1' });
   */
  constructor(data: Partial<CreateRoomDto>) {
    Object.assign(this, data);
  }
}
