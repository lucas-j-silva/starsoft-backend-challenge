/**
 * @fileoverview Use case for finding a single payment.
 *
 * @description
 * This file contains the use case responsible for retrieving a payment by its
 * identifier. When a user ID is provided the lookup is scoped to that user,
 * otherwise the payment is retrieved by ID alone.
 *
 * @module find-payment.use-case
 */

import { Injectable } from '@nestjs/common';
import { FindPaymentDto } from '../dtos';
import { IFindPaymentUseCase } from '../interfaces';
import { PaymentsRepository } from '../repositories/payments.repository';
import { PaymentSchema } from '../schemas';

/**
 * Use case for finding a payment by its identifier.
 *
 * @description
 * Handles the business logic for retrieving a single payment record. If the
 * supplied DTO includes a user ID the lookup is additionally scoped to that
 * user, preventing cross-user access. Otherwise the payment is fetched by its
 * primary ID alone.
 *
 * @class FindPaymentUseCase
 * @implements {IFindPaymentUseCase}
 */
@Injectable()
export class FindPaymentUseCase implements IFindPaymentUseCase {
  /**
   * Creates an instance of FindPaymentUseCase.
   *
   * @param {PaymentsRepository} paymentsRepository - Repository for payment retrieval operations.
   */
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  /**
   * Executes the find payment process.
   *
   * @description
   * When `dto.userId` is present, delegates to `findByIdAndUserId` to ensure
   * the payment belongs to the requesting user. Otherwise delegates to
   * `findById` to retrieve the payment by its primary key alone.
   *
   * @async
   * @param {FindPaymentDto} dto - The DTO containing the payment ID and an optional user ID.
   * @returns {Promise<PaymentSchema>} A promise that resolves to the found payment entity.
   *
   * @example
   * const payment = await useCase.execute({
   *   id: '123e4567-e89b-12d3-a456-426614174000',
   *   userId: 'user-uuid',
   * });
   * // Returns: { id: '...', userId: 'user-uuid', amountInCents: 2500, status: 'PENDING', ... }
   */
  async execute(dto: FindPaymentDto): Promise<PaymentSchema> {
    const payment = await (dto.userId
      ? this.paymentsRepository.findByIdAndUserId(dto.id, dto.userId)
      : this.paymentsRepository.findById(dto.id));

    return payment;
  }
}
