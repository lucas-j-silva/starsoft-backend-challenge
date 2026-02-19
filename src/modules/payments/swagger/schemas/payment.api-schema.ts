/**
 * @fileoverview Swagger API schema for the payment entity.
 *
 * @description
 * This file defines the PaymentApiSchema class used as the OpenAPI/Swagger
 * response shape for individual payment records. It documents all fields of the
 * payment entity as returned by the payments API endpoints.
 *
 * @module payment.api-schema
 */

import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PaymentStatus } from '../../enums/payment-status.enum';

/**
 * Swagger API schema representing a single payment entity.
 *
 * @description
 * Documents the structure of a payment object as returned by the API.
 * Used as the response type annotation for payment-related endpoints so that
 * Swagger UI renders the correct shape for payment responses.
 *
 * @example
 * // Used as a response type in a controller
 * @ApiResponse({ status: 200, type: PaymentApiSchema })
 * getPayment(): PaymentApiSchema { ... }
 */
@ApiSchema({
  name: 'PaymentApiSchema',
  description: 'The schema for the payment entity',
})
export class PaymentApiSchema {
  /**
   * Unique identifier of the payment.
   *
   * @type {string}
   * @memberof PaymentApiSchema
   * @description UUID primary key identifying this payment record.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @ApiProperty({
    description: 'The ID of the payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  /**
   * UUID of the user who owns this payment.
   *
   * @type {string}
   * @memberof PaymentApiSchema
   * @description Foreign key reference to the user who initiated the payment.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @ApiProperty({
    description: 'The user ID of the payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  userId: string;

  /**
   * Payment amount expressed in cents.
   *
   * @type {number}
   * @memberof PaymentApiSchema
   * @description The total payment value in the smallest currency unit (e.g. 100 = $1.00).
   * @example 100
   */
  @ApiProperty({
    description: 'The amount of the payment',
    example: 100,
  })
  amountInCents: number;

  /**
   * Current lifecycle status of the payment.
   *
   * @type {PaymentStatus}
   * @memberof PaymentApiSchema
   * @description One of PENDING, APPROVED, or EXPIRED reflecting the payment's state.
   * @example "PENDING"
   */
  @ApiProperty({
    description: 'The status of the payment',
    example: 'PENDING',
  })
  status: PaymentStatus;

  /**
   * Timestamp when the payment was approved.
   *
   * @type {Date}
   * @memberof PaymentApiSchema
   * @description ISO 8601 timestamp set when the payment transitions to APPROVED status.
   * @example "2021-01-01T00:00:00.000Z"
   */
  @ApiProperty({
    description: 'The approved at timestamp of the payment',
    example: '2021-01-01T00:00:00.000Z',
  })
  approvedAt: Date;

  /**
   * Timestamp when the payment expires.
   *
   * @type {Date}
   * @memberof PaymentApiSchema
   * @description ISO 8601 timestamp after which the payment transitions to EXPIRED if unpaid.
   * @example "2021-01-01T00:00:00.000Z"
   */
  @ApiProperty({
    description: 'The expires at timestamp of the payment',
    example: '2021-01-01T00:00:00.000Z',
  })
  expiresAt: Date;

  /**
   * Timestamp when the payment record was created.
   *
   * @type {Date}
   * @memberof PaymentApiSchema
   * @description ISO 8601 timestamp automatically set at record creation time.
   * @example "2021-01-01T00:00:00.000Z"
   */
  @ApiProperty({
    description: 'The created at timestamp of the payment',
    example: '2021-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  /**
   * Timestamp when the payment record was last updated.
   *
   * @type {Date}
   * @memberof PaymentApiSchema
   * @description ISO 8601 timestamp automatically updated whenever the record changes.
   * @example "2021-01-01T00:00:00.000Z"
   */
  @ApiProperty({
    description: 'The updated at timestamp of the payment',
    example: '2021-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  /**
   * External reference identifier for cross-system payment tracking.
   *
   * @type {string}
   * @memberof PaymentApiSchema
   * @description An optional identifier supplied by an external system for correlation.
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  @ApiProperty({
    description: 'The external ID of the payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  externalId: string;
}
