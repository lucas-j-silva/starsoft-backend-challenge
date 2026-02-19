/**
 * @fileoverview Interface defining the contract for the Create Payment use case.
 *
 * @description
 * This file declares the interface that any Create Payment use case implementation
 * must satisfy, ensuring a consistent API for payment creation across the module.
 *
 * @module create-payment.use-case.interface
 */

import { CreatePaymentDto } from '../dtos';
import { PaymentSchema } from '../schemas';

/**
 * Interface defining the contract for the Create Payment use case.
 * Implements the use case pattern for creating new payment entities.
 *
 * @interface ICreatePaymentUseCase
 *
 * @example
 * class CreatePaymentUseCase implements ICreatePaymentUseCase {
 *   async execute(dto: CreatePaymentDto): Promise<PaymentSchema> {
 *     // Implementation logic
 *   }
 * }
 */
export interface ICreatePaymentUseCase {
  /**
   * Executes the create payment use case.
   *
   * @param {CreatePaymentDto} dto - The data transfer object containing payment creation details.
   * @returns {Promise<PaymentSchema>} A promise that resolves to the newly created payment entity.
   *
   * @example
   * const payment = await createPaymentUseCase.execute({
   *   userId: '123e4567-e89b-12d3-a456-426614174000',
   *   amountInCents: 2500,
   *   expiresAt: new Date('2026-03-01T00:00:00Z'),
   *   externalId: 'ext-ref-001',
   * });
   */
  execute(dto: CreatePaymentDto): Promise<PaymentSchema>;
}
