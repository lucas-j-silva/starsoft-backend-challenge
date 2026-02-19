/**
 * @fileoverview Controller for managing payments.
 *
 * @description
 * This file contains the controller responsible for handling HTTP requests
 * related to payment operations. It provides endpoints for finding a payment
 * by ID, listing payments with pagination and filter, and approving payments.
 *
 * @module payments.controller
 */

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
} from '@nestjs/common';
import { PaymentsService } from '../services/payments.service';
import { ListPaymentsWithPaginationAndFilterQueryDto } from '../dtos';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import {
  PaymentApiSchema,
  PaymentsPaginationResultApiSchema,
} from '../swagger/schemas';

/**
 * REST API controller for payment-related operations.
 *
 * @description
 * Handles HTTP requests for payment management including retrieving payments by ID,
 * listing payments with pagination and filtering, and approving payments.
 * All endpoints are scoped to the authenticated user's session.
 *
 * @class PaymentsController
 * @decorator Controller - Registers this class as a NestJS controller with the 'payments' route prefix.
 */
@Controller('payments')
export class PaymentsController {
  /**
   * Creates an instance of PaymentsController.
   *
   * @param {PaymentsService} paymentsService - The service responsible for payment business logic.
   */
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Finds a payment by its unique identifier, scoped to the authenticated user.
   *
   * @async
   * @param {string} id - The UUID of the payment to retrieve.
   * @param {UserSession} session - The authenticated user session, injected via session cookie.
   * @returns {Promise<PaymentApiSchema>} A promise that resolves to the found payment.
   * @throws {NotFoundException} When no payment is found with the given ID for the authenticated user.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Find a payment by ID',
    description: 'Retrieves a payment by its unique identifier',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The payment has been successfully retrieved.',
    type: PaymentApiSchema,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The payment with the specified ID was not found.',
  })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  async findPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return this.paymentsService.findPayment({ id, userId: session.user.id });
  }

  /**
   * Lists payments for the authenticated user with pagination and optional status filter.
   *
   * @async
   * @param {ListPaymentsWithPaginationAndFilterQueryDto} query - Query parameters including page, limit, and optional status filter.
   * @param {UserSession} session - The authenticated user session, injected via session cookie.
   * @returns {Promise<PaymentsPaginationResultApiSchema>} A promise that resolves to a paginated list of payments.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List payments with pagination and filter',
    description: 'Lists all payments with pagination and filter',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Payments listed successfully',
    type: PaymentsPaginationResultApiSchema,
  })
  async listWithPaginationAndFilter(
    @Query() query: ListPaymentsWithPaginationAndFilterQueryDto,
    @Session() session: UserSession,
  ) {
    return this.paymentsService.listWithPaginationAndFilter({
      page: query.page,
      limit: query.limit,
      status: query.status,
      userId: session.user.id,
    });
  }

  /**
   * Approves a payment identified by either its internal UUID or its external identifier.
   *
   * @async
   * @param {string} idOrExternalId - The internal UUID or the external identifier of the payment to approve.
   * @returns {Promise<void>} A promise that resolves when the payment has been successfully approved.
   * @throws {NotFoundException} When no payment is found with the given ID or external ID.
   */
  @Put(':idOrExternalId/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Approve a payment',
    description:
      'Approves a payment by its unique identifier or external identifier',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The payment has been successfully approved.',
  })
  @ApiParam({
    name: 'idOrExternalId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      'The payment with the specified ID or external ID was not found.',
  })
  async approvePayment(@Param('idOrExternalId') idOrExternalId: string) {
    return this.paymentsService.approvePayment({ idOrExternalId });
  }
}
