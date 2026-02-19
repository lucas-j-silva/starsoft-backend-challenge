/**
 * @fileoverview Swagger API schema for paginated payment listing results.
 *
 * @description
 * This file defines the PaymentsPaginationResultApiSchema class used as the
 * OpenAPI/Swagger response shape for paginated payment list endpoints. It wraps
 * an array of PaymentApiSchema objects alongside pagination metadata.
 *
 * @module payments-pagination-result.api-schema
 */

import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { PaymentApiSchema } from './payment.api-schema';
import { PaginationMetadataDto } from '../../../../shared/dtos/pagination-metadata.dto';

/**
 * Swagger API schema representing a paginated list of payment entities.
 *
 * @description
 * Documents the structure of the response returned by paginated payment list endpoints.
 * Combines an array of payment records with pagination metadata (total count, page info, etc.)
 * so that API consumers can implement client-side pagination controls.
 *
 * @example
 * // Used as a response type in a controller
 * @ApiResponse({ status: 200, type: PaymentsPaginationResultApiSchema })
 * listPayments(): PaymentsPaginationResultApiSchema { ... }
 */
@ApiSchema({
  name: 'PaymentsPaginationResultApiSchema',
  description: 'The schema for the pagination result of payments',
})
export class PaymentsPaginationResultApiSchema {
  /**
   * Array of payment records for the current page.
   *
   * @type {PaymentApiSchema[]}
   * @memberof PaymentsPaginationResultApiSchema
   * @description The list of payment entities returned for the requested page and filters.
   */
  @ApiProperty({
    description: 'The data of the pagination result',
    type: [PaymentApiSchema],
  })
  data: PaymentApiSchema[];

  /**
   * Pagination metadata describing the current result set.
   *
   * @type {PaginationMetadataDto}
   * @memberof PaymentsPaginationResultApiSchema
   * @description Contains information such as total record count, current page number,
   * page size, and total number of pages to support client-side navigation.
   */
  @ApiProperty({
    description: 'The metadata of the pagination result',
    type: PaginationMetadataDto,
  })
  metadata: PaginationMetadataDto;
}
