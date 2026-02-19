/**
 * @fileoverview Data Transfer Object for approving a payment.
 *
 * @description
 * This DTO defines the validation rules and structure for payment approval requests.
 * Used to validate incoming data when approving an existing payment by its internal
 * UUID or an external identifier.
 *
 * @module approve-payment.dto
 */

import { IsNotEmpty, IsUUID } from 'class-validator';

/**
 * Data Transfer Object for approving a payment.
 *
 * @description
 * Validates and transfers the identifier required to approve an existing payment.
 * Accepts either the payment's internal UUID or an external reference identifier,
 * allowing flexible lookup and approval of pending payments.
 *
 * @example
 * // Approving by internal UUID
 * const dto = new ApprovePaymentDto({ idOrExternalId: '123e4567-e89b-12d3-a456-426614174000' });
 *
 * @example
 * // Approving by external identifier
 * const dto = new ApprovePaymentDto({ idOrExternalId: 'ext-ref-abc123' });
 */
export class ApprovePaymentDto {
  /**
   * The payment's internal UUID or external reference identifier.
   *
   * @type {string}
   * @memberof ApprovePaymentDto
   * @description A required non-empty string that represents either the payment's UUID
   * primary key or an external system identifier used to locate and approve the payment.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  idOrExternalId: string;

  /**
   * Creates an instance of ApprovePaymentDto.
   *
   * @param {Partial<ApprovePaymentDto>} data - Partial data to initialize the DTO.
   * @example
   * const dto = new ApprovePaymentDto({ idOrExternalId: '123e4567-e89b-12d3-a456-426614174000' });
   */
  constructor(data: Partial<ApprovePaymentDto>) {
    Object.assign(this, data);
  }
}
