/**
 * @fileoverview Use case for creating a payment.
 *
 * @description
 * This file contains the use case responsible for handling the creation of
 * new payment records. It delegates the insertion to the payments repository
 * and returns the persisted payment entity.
 *
 * @module create-payment.use-case
 */

import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dtos';
import { ICreatePaymentUseCase } from '../interfaces';
import { PaymentsRepository } from '../repositories/payments.repository';
import { PaymentSchema } from '../schemas';

/**
 * Use case for creating a new payment.
 *
 * @description
 * Handles the business logic for inserting a payment record into the data
 * store. Accepts a DTO with payment details, delegates to the repository,
 * and returns the resulting persisted payment schema.
 *
 * @class CreatePaymentUseCase
 * @implements {ICreatePaymentUseCase}
 */
@Injectable()
export class CreatePaymentUseCase implements ICreatePaymentUseCase {
  /**
   * Creates an instance of CreatePaymentUseCase.
   *
   * @param {PaymentsRepository} paymentsRepository - Repository for payment persistence operations.
   */
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  /**
   * Executes the payment creation process.
   *
   * @description
   * Inserts a new payment record into the data store using the provided DTO
   * fields and returns the newly created payment entity.
   *
   * @async
   * @param {CreatePaymentDto} dto - The data transfer object containing payment creation details.
   * @returns {Promise<PaymentSchema>} A promise that resolves to the created payment entity.
   *
   * @example
   * const payment = await useCase.execute({
   *   userId: '123e4567-e89b-12d3-a456-426614174000',
   *   amountInCents: 2500,
   *   expiresAt: new Date('2026-03-01T00:00:00Z'),
   *   externalId: 'ext-ref-001',
   * });
   * // Returns: { id: '...', userId: '...', amountInCents: 2500, status: 'PENDING', ... }
   */
  async execute(dto: CreatePaymentDto): Promise<PaymentSchema> {
    const payment = await this.paymentsRepository.insert({
      userId: dto.userId,
      amountInCents: dto.amountInCents,
      expiresAt: dto.expiresAt,
      externalId: dto.externalId,
    });

    return payment;
  }
}
