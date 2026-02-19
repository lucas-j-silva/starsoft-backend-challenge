/**
 * @fileoverview Interface defining the contract for the Find Payment use case.
 *
 * @description
 * This file declares the interface that any Find Payment use case implementation
 * must satisfy, ensuring a consistent API for single payment retrieval across
 * the module.
 *
 * @module find-payment.use-case.interface
 */

import { FindPaymentDto } from '../dtos';
import { PaymentSchema } from '../schemas';

/**
 * Interface defining the contract for the Find Payment use case.
 * Implements the use case pattern for retrieving a single payment entity.
 *
 * @interface IFindPaymentUseCase
 *
 * @example
 * class FindPaymentUseCase implements IFindPaymentUseCase {
 *   async execute(dto: FindPaymentDto): Promise<PaymentSchema> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IFindPaymentUseCase {
  /**
   * Executes the find payment use case.
   *
   * @param {FindPaymentDto} dto - The DTO containing the payment ID and an optional user ID.
   * @returns {Promise<PaymentSchema>} A promise that resolves to the found payment entity.
   *
   * @example
   * const payment = await findPaymentUseCase.execute({
   *   id: '123e4567-e89b-12d3-a456-426614174000',
   *   userId: 'user-uuid',
   * });
   */
  execute(dto: FindPaymentDto): Promise<PaymentSchema>;
}
