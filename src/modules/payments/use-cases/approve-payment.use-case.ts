/**
 * @fileoverview Use case for approving a payment.
 *
 * @description
 * This file contains the use case responsible for handling payment approval.
 * It validates the payment status and expiry, transitions the payment to the
 * APPROVED state, and emits a payment approved Kafka event.
 *
 * @module approve-payment.use-case
 */

import { IApprovePaymentUseCase } from '../interfaces/approve-payment.use-case.interface';
import { PaymentsRepository } from '../repositories/payments.repository';
import { ApprovePaymentDto } from '../dtos';
import { Injectable } from '@nestjs/common';
import { PaymentStatus } from '../enums/payment-status.enum';
import { UnableToApprovePaymentException } from '../exceptions/unable-to-approve-payment.exception';
import { PaymentsProducer } from '../events/producers';

/**
 * Use case for approving a pending payment.
 *
 * @description
 * Handles the business logic for transitioning a payment from PENDING to
 * APPROVED. Looks up the payment by its internal ID or external ID, validates
 * that it is still in PENDING status and has not yet expired, updates the
 * status to APPROVED with an approval timestamp, and emits a payment approved
 * Kafka event to notify downstream consumers.
 *
 * @class ApprovePaymentUseCase
 * @implements {IApprovePaymentUseCase}
 */
@Injectable()
export class ApprovePaymentUseCase implements IApprovePaymentUseCase {
  /**
   * Creates an instance of ApprovePaymentUseCase.
   *
   * @param {PaymentsRepository} paymentsRepository - Repository for payment data operations.
   * @param {PaymentsProducer} paymentsProducer - Kafka event producer for payment events.
   */
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly paymentsProducer: PaymentsProducer,
  ) {}

  /**
   * Executes the payment approval process.
   *
   * @description
   * Retrieves the payment by its internal ID or external ID. Validates that
   * the payment is in PENDING status and has not expired. Updates the payment
   * status to APPROVED with the current timestamp as the approval date, then
   * emits a payment approved event via Kafka.
   *
   * @async
   * @param {ApprovePaymentDto} data - The DTO containing the payment identifier (internal or external).
   * @returns {Promise<void>} A promise that resolves when the payment has been approved and the event emitted.
   * @throws {UnableToApprovePaymentException} When the payment status is not PENDING.
   * @throws {UnableToApprovePaymentException} When the payment has already expired.
   *
   * @example
   * await useCase.execute({
   *   idOrExternalId: '123e4567-e89b-12d3-a456-426614174000',
   * });
   * // Payment status transitions from PENDING to APPROVED and event is emitted.
   */
  async execute(data: ApprovePaymentDto): Promise<void> {
    const payment = await this.paymentsRepository.findByIdOrExternalId(
      data.idOrExternalId,
    );

    if (payment.status !== PaymentStatus.PENDING) {
      throw new UnableToApprovePaymentException('Payment is not pending');
    }

    if (payment.expiresAt && payment.expiresAt < new Date()) {
      throw new UnableToApprovePaymentException('Payment has expired');
    }

    const updatedPayment = await this.paymentsRepository.update(payment.id, {
      status: PaymentStatus.APPROVED,
      approvedAt: new Date(),
    });

    await this.paymentsProducer.sendPaymentApprovedEvent({
      id: updatedPayment.id,
      userId: updatedPayment.userId,
      amountInCents: updatedPayment.amountInCents,
      expiresAt: updatedPayment.expiresAt,
      approvedAt: updatedPayment.approvedAt as Date,
      externalId: updatedPayment.externalId,
    });

    return;
  }
}
