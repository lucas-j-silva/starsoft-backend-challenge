/**
 * @fileoverview Data Transfer Objects for listing payments with pagination and filtering.
 *
 * @description
 * This file contains DTOs used to validate and transfer data for paginated payment
 * listing requests. Supports filtering by user ID and payment status, and also
 * exports a query-only variant that omits the server-side userId field.
 *
 * @module list-payments-with-pagination-and-filter.dto
 */

import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../shared/dtos/pagination.dto';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PickType, ApiProperty, ApiSchema } from '@nestjs/swagger';

/**
 * Data Transfer Object for listing payments with pagination and optional filtering.
 *
 * @description
 * Extends PaginationDto to add payment-specific filter fields. Requires a userId
 * to scope the result set and accepts an optional status filter. This DTO is
 * typically constructed server-side after authentication resolves the user identity.
 *
 * @example
 * // Listing all pending payments for a user
 * const dto = new ListPaymentsWithPaginationAndFilterDto({
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 *   status: PaymentStatus.PENDING,
 *   page: 1,
 *   limit: 10,
 * });
 *
 * @example
 * // Listing all payments for a user without status filter
 * const dto = new ListPaymentsWithPaginationAndFilterDto({
 *   userId: '123e4567-e89b-12d3-a456-426614174000',
 * });
 */
@ApiSchema({
  name: 'ListPaymentsWithPaginationAndFilterDto',
  description: 'The schema for the list payments with pagination and filter',
})
export class ListPaymentsWithPaginationAndFilterDto extends PaginationDto {
  /**
   * UUID of the user whose payments are being listed.
   *
   * @type {string}
   * @memberof ListPaymentsWithPaginationAndFilterDto
   * @description Required UUID that scopes the payment list to a specific user.
   * Ensures that users can only retrieve payments associated with their account.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @IsNotEmpty({ message: 'validation.IS_NOT_EMPTY' })
  @IsUUID(undefined, { message: 'validation.INVALID_UUID' })
  @ApiProperty({
    description: 'The user ID of the payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  /**
   * Optional payment status filter.
   *
   * @type {PaymentStatus}
   * @memberof ListPaymentsWithPaginationAndFilterDto
   * @description When provided, restricts the result set to payments with the given status.
   * Must be a valid value from the PaymentStatus enum (PENDING, APPROVED, or EXPIRED).
   * @example "PENDING"
   */
  @IsOptional({ message: 'validation.IS_OPTIONAL' })
  @IsEnum(PaymentStatus, { message: 'validation.INVALID_ENUM' })
  @ApiProperty({
    description: 'The status of the payment',
    example: 'PENDING',
    enum: PaymentStatus,
    required: false,
  })
  status?: PaymentStatus;

  /**
   * Creates an instance of ListPaymentsWithPaginationAndFilterDto.
   *
   * @param {Partial<ListPaymentsWithPaginationAndFilterDto>} data - Partial data to initialize the DTO.
   * @example
   * const dto = new ListPaymentsWithPaginationAndFilterDto({ userId: '123e4567-e89b-12d3-a456-426614174000', page: 1, limit: 20 });
   */
  constructor(data: Partial<ListPaymentsWithPaginationAndFilterDto>) {
    super({});

    Object.assign(this, data);
  }
}

/**
 * Query-only DTO for listing payments via HTTP query parameters.
 *
 * @description
 * A subset of ListPaymentsWithPaginationAndFilterDto that includes only the fields
 * appropriate for client-supplied query parameters (page, limit, status). The userId
 * is intentionally excluded because it is resolved server-side from the authenticated
 * session and merged into the full DTO before processing.
 *
 * @example
 * // Constructed from query params: GET /payments?page=1&limit=10&status=APPROVED
 * const queryDto = new ListPaymentsWithPaginationAndFilterQueryDto();
 * queryDto.page = 1;
 * queryDto.limit = 10;
 * queryDto.status = PaymentStatus.APPROVED;
 */
export class ListPaymentsWithPaginationAndFilterQueryDto extends PickType(
  ListPaymentsWithPaginationAndFilterDto,
  ['page', 'limit', 'status'],
) {}
