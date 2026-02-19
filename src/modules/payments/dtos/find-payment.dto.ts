/**
 * @fileoverview Data Transfer Object for finding a specific payment.
 *
 * @description
 * This DTO defines the validation rules and structure for payment lookup requests.
 * Used to validate incoming data when retrieving a specific payment by its UUID,
 * with an optional user scope to restrict access to the user's own payments.
 *
 * @module find-payment.dto
 */

import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for finding a specific payment.
 *
 * @description
 * Validates and transfers data required to locate a single payment record.
 * Supports optional user scoping so that non-admin callers can only retrieve
 * payments that belong to them.
 *
 * @example
 * // Finding any payment by ID (admin usage)
 * const dto = new FindPaymentDto({ id: '123e4567-e89b-12d3-a456-426614174000' });
 *
 * @example
 * // Finding a payment restricted to a specific user
 * const dto = new FindPaymentDto({ id: '123e4567-e89b-12d3-a456-426614174000', userId: '550e8400-e29b-41d4-a716-446655440000' });
 */
export class FindPaymentDto {
  /**
   * The unique identifier of the payment to retrieve.
   *
   * @type {string}
   * @memberof FindPaymentDto
   * @description Must be a valid UUID corresponding to an existing payment record. Required field.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  id: string;

  /**
   * Optional UUID of the user whose payments are being queried.
   *
   * @type {string}
   * @memberof FindPaymentDto
   * @description When provided, restricts the lookup to payments owned by this user,
   * preventing users from accessing payments that do not belong to them.
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @IsOptional()
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  userId?: string;

  /**
   * Creates an instance of FindPaymentDto.
   *
   * @param {Partial<FindPaymentDto>} data - Partial data to initialize the DTO.
   * @example
   * const dto = new FindPaymentDto({ id: '123e4567-e89b-12d3-a456-426614174000', userId: '550e8400-e29b-41d4-a716-446655440000' });
   */
  constructor(data: Partial<FindPaymentDto>) {
    Object.assign(this, data);
  }
}
