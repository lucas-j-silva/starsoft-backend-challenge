/**
 * @fileoverview Service for managing payment operations.
 *
 * @description
 * This file contains the service class that provides a facade for payment
 * operations including creating payments, handling reservation events,
 * listing with pagination and filter, approving, and finding payments.
 * It delegates to specialized use cases for each operation.
 *
 * @module payments.service
 */

import { Injectable } from '@nestjs/common';
import {
  ApprovePaymentDto,
  CreatePaymentDto,
  FindPaymentDto,
  ListPaymentsWithPaginationAndFilterDto,
} from '../dtos';
import { CreatePaymentUseCase } from '../use-cases/create-payment.use-case';
import { PaymentSchema } from '../schemas';
import { HandleReservationCreatedUseCase } from '../use-cases/handle-reservation-created.use-case';
import { ListPaymentsWithPaginationAndFilterUseCase } from '../use-cases/list-payments-with-pagination-and-filter.use-case';
import { PaginationResultDto } from '../../../shared/dtos/pagination-result.dto';
import { ApprovePaymentUseCase } from '../use-cases/approve-payment.use-case';
import { FindPaymentUseCase } from '../use-cases/find-payment.use-case';
import { HandleSessionSeatReservationConflictUseCase } from '../use-cases/handle-session-seat-reservation-conflict.use-case';
import {
  SessionSeatReservationConflictMessage,
  ReservationCreatedMessage,
} from '../../sessions/seats/events/messages';

/**
 * Service for payment management operations.
 *
 * @description
 * Provides methods for creating payments, handling reservation created events,
 * listing payments with pagination and filter, approving payments, and finding
 * individual payments. Acts as a facade that delegates to specialized use cases
 * for each operation.
 *
 * @class PaymentsService
 *
 * @example
 * // Creating a payment
 * const payment = await paymentsService.create({ reservationId: 'uuid', amountInCents: 2500 });
 *
 * @example
 * // Listing payments with pagination and filter
 * const result = await paymentsService.listWithPaginationAndFilter({
 *   page: 1,
 *   limit: 10,
 *   userId: 'user-uuid',
 *   status: 'PENDING'
 * });
 *
 * @example
 * // Approving a payment
 * await paymentsService.approvePayment({ idOrExternalId: 'payment-uuid' });
 */
@Injectable()
export class PaymentsService {
  /**
   * Creates an instance of PaymentsService.
   *
   * @param {CreatePaymentUseCase} createPaymentUseCase - Use case for creating a new payment.
   * @param {HandleReservationCreatedUseCase} handleReservationCreatedUseCase - Use case for handling reservation created events.
   * @param {ListPaymentsWithPaginationAndFilterUseCase} listPaymentsWithPaginationAndFilterUseCase - Use case for listing payments with pagination and filter.
   * @param {ApprovePaymentUseCase} approvePaymentUseCase - Use case for approving a payment.
   * @param {FindPaymentUseCase} findPaymentUseCase - Use case for finding a payment by ID.
   */
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly handleReservationCreatedUseCase: HandleReservationCreatedUseCase,
    private readonly listPaymentsWithPaginationAndFilterUseCase: ListPaymentsWithPaginationAndFilterUseCase,
    private readonly approvePaymentUseCase: ApprovePaymentUseCase,
    private readonly findPaymentUseCase: FindPaymentUseCase,
    private readonly handleSessionSeatReservationConflictUseCase: HandleSessionSeatReservationConflictUseCase,
  ) {}

  /**
   * Creates a new payment record.
   *
   * @async
   * @param {CreatePaymentDto} data - The data required to create a payment.
   * @returns {Promise<PaymentSchema>} A promise that resolves to the newly created payment.
   *
   * @example
   * const payment = await paymentsService.create({ reservationId: '550e8400-e29b-41d4-a716-446655440000', amountInCents: 2500 });
   * // Returns: { id: '...', status: 'PENDING', amountInCents: 2500, ... }
   */
  async create(data: CreatePaymentDto): Promise<PaymentSchema> {
    return this.createPaymentUseCase.execute(data);
  }

  /**
   * Handles a reservation created event by initiating the payment flow.
   *
   * @async
   * @param {ReservationCreatedMessage} payload - The reservation created message payload.
   * @returns {Promise<void>} A promise that resolves when the event has been handled.
   *
   * @example
   * await paymentsService.handleReservationCreated({
   *   reservationId: 'reservation-uuid',
   *   sessionSeatId: 'seat-uuid',
   *   userId: 'user-uuid',
   *   expiresAt: new Date()
   * });
   */
  async handleReservationCreated(
    payload: ReservationCreatedMessage,
  ): Promise<void> {
    return this.handleReservationCreatedUseCase.execute(payload);
  }

  /**
   * Lists payments for a user with pagination and an optional status filter.
   *
   * @async
   * @param {ListPaymentsWithPaginationAndFilterDto} data - Pagination parameters and optional filter data including userId and status.
   * @returns {Promise<PaginationResultDto<PaymentSchema>>} A promise that resolves to a paginated list of payments.
   *
   * @example
   * const result = await paymentsService.listWithPaginationAndFilter({
   *   page: 1,
   *   limit: 10,
   *   userId: 'user-uuid',
   *   status: 'APPROVED'
   * });
   * // Returns: { data: [...], metadata: { currentPage: 1, totalPages: 3, limit: 10 } }
   */
  async listWithPaginationAndFilter(
    data: ListPaymentsWithPaginationAndFilterDto,
  ): Promise<PaginationResultDto<PaymentSchema>> {
    return this.listPaymentsWithPaginationAndFilterUseCase.execute(data);
  }

  /**
   * Approves a payment identified by its internal UUID or external identifier.
   *
   * @async
   * @param {ApprovePaymentDto} data - The data containing the internal or external payment identifier.
   * @returns {Promise<void>} A promise that resolves when the payment has been approved.
   * @throws {PaymentNotFoundException} When no payment is found with the given identifier.
   *
   * @example
   * await paymentsService.approvePayment({ idOrExternalId: '123e4567-e89b-12d3-a456-426614174000' });
   */
  async approvePayment(data: ApprovePaymentDto): Promise<void> {
    return this.approvePaymentUseCase.execute(data);
  }

  /**
   * Finds a payment by its ID, scoped to the owning user.
   *
   * @async
   * @param {FindPaymentDto} data - The data containing the payment ID and user ID for ownership verification.
   * @returns {Promise<PaymentSchema>} A promise that resolves to the found payment.
   * @throws {PaymentNotFoundException} When no payment is found with the given ID for the specified user.
   *
   * @example
   * const payment = await paymentsService.findPayment({
   *   id: '550e8400-e29b-41d4-a716-446655440000',
   *   userId: 'user-uuid'
   * });
   * // Returns: { id: '...', status: 'PENDING', amountInCents: 2500, ... }
   */
  async findPayment(data: FindPaymentDto): Promise<PaymentSchema> {
    return this.findPaymentUseCase.execute(data);
  }

  /**
   * Handles a session seat reservation conflict by processing the refund.
   *
   * @description
   * This method is invoked when a payment was approved but the associated
   * seat was already sold, resulting in a conflict. It delegates to the
   * use case responsible for refunding the payment and updating its status
   * to REFUNDED.
   *
   * @async
   * @param {SessionSeatReservationConflictMessage} payload - The conflict event data containing
   *   the reservation ID, session seat ID, and user ID involved in the conflict.
   * @returns {Promise<void>} A promise that resolves when the conflict has been handled.
   *
   * @example
   * await paymentsService.handleSessionSeatReservationConflict({
   *   reservationId: '550e8400-e29b-41d4-a716-446655440000',
   *   sessionSeatId: '550e8400-e29b-41d4-a716-446655440001',
   *   userId: '550e8400-e29b-41d4-a716-446655440002',
   * });
   */
  async handleSessionSeatReservationConflict(
    payload: SessionSeatReservationConflictMessage,
  ): Promise<void> {
    return this.handleSessionSeatReservationConflictUseCase.execute(payload);
  }
}
