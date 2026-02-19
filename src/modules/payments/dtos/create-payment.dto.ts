/**
 * @fileoverview Data Transfer Object for creating a new payment.
 *
 * @description
 * This DTO defines the validation rules and structure for payment creation requests.
 * Used to validate incoming data when initiating a new payment transaction.
 *
 * @module create-payment.dto
 */

import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

/**
 * Data Transfer Object for creating a new payment.
 *
 * @description
 * Validates and transfers data required to initiate a new payment.
 * Ensures all required fields are present and meet validation requirements
 * before the payment is processed.
 *
 * @example
 * // Creating a minimal payment DTO
 * const dto = new CreatePaymentDto({ userId: '123e4567-e89b-12d3-a456-426614174000', amountInCents: 2500 });
 *
 * @example
 * // Creating a full payment DTO with optional fields
 * const dto = new CreatePaymentDto({ userId: '123e4567-e89b-12d3-a456-426614174000', amountInCents: 2500, expiresAt: new Date('2024-12-31T23:59:59Z'), externalId: 'ext-ref-abc123' });
 */
export class CreatePaymentDto {
  /**
   * UUID of the user initiating the payment.
   *
   * @type {string}
   * @memberof CreatePaymentDto
   * @description Must be a valid UUID identifying an existing user. Required field.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  userId: string;

  /**
   * Payment amount expressed in cents (smallest currency unit).
   *
   * @type {number}
   * @memberof CreatePaymentDto
   * @description Must be a positive integer. For example, 2500 represents $25.00. Required field.
   * @example 2500
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsInt({ message: 'validation.IS_INT' })
  @IsPositive({ message: 'validation.IS_POSITIVE' })
  amountInCents: number;

  /**
   * Optional expiration date and time for the payment.
   *
   * @type {Date}
   * @memberof CreatePaymentDto
   * @description When provided, the payment will expire at this timestamp if not approved beforehand.
   * @example new Date('2024-12-31T23:59:59Z')
   */
  @IsOptional()
  @IsDate({ message: 'validation.INVALID_DATE' })
  expiresAt?: Date;

  /**
   * Optional external reference identifier for the payment.
   *
   * @type {string}
   * @memberof CreatePaymentDto
   * @description An optional string identifier from an external system for cross-referencing.
   * @example "ext-ref-abc123"
   */
  @IsOptional()
  @IsString({ message: 'validation.INVALID_STRING' })
  externalId?: string;

  /**
   * Creates an instance of CreatePaymentDto.
   *
   * @param {Partial<CreatePaymentDto>} data - Partial data to initialize the DTO.
   * @example
   * const dto = new CreatePaymentDto({ userId: '123e4567-e89b-12d3-a456-426614174000', amountInCents: 2500, expiresAt: new Date('2024-12-31T23:59:59Z'), externalId: 'ext-ref-abc123' });
   */
  constructor(data: Partial<CreatePaymentDto>) {
    Object.assign(this, data);
  }
}
