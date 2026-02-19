/**
 * @fileoverview Interface defining the contract for the Approve Payment use case.
 *
 * @description
 * This file declares the interface that any Approve Payment use case implementation
 * must satisfy, ensuring a consistent API for transitioning payments from PENDING
 * to APPROVED across the module.
 *
 * @module approve-payment.use-case.interface
 */

import { ApprovePaymentDto } from '../dtos';

/**
 * Interface defining the contract for the Approve Payment use case.
 * Implements the use case pattern for approving pending payment entities.
 *
 * @interface IApprovePaymentUseCase
 *
 * @example
 * class ApprovePaymentUseCase implements IApprovePaymentUseCase {
 *   async execute(dto: ApprovePaymentDto): Promise<void> {
 *     // Implementation logic
 *   }
 * }
 */
export interface IApprovePaymentUseCase {
  /**
   * Executes the approve payment use case.
   *
   * @param {ApprovePaymentDto} dto - The DTO containing the payment identifier (internal or external).
   * @returns {Promise<void>} A promise that resolves when the payment has been approved and the event emitted.
   *
   * @example
   * await approvePaymentUseCase.execute({
   *   idOrExternalId: '123e4567-e89b-12d3-a456-426614174000',
   * });
   */
  execute(dto: ApprovePaymentDto): Promise<void>;
}
