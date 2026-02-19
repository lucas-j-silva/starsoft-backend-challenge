/**
 * @fileoverview Scheduler for managing payment expiration processing.
 *
 * @description
 * This file contains the PaymentsScheduler class responsible for periodically
 * detecting and processing expired payments. It transitions PENDING payments
 * past their expiry date to EXPIRED status and emits corresponding Kafka events.
 *
 * @module payments.scheduler
 */

import { Cron, CronExpression } from '@nestjs/schedule';
import { PaymentsRepository } from '../repositories/payments.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentsProducer } from '../events/producers';

/**
 * Scheduler for payment expiration handling.
 *
 * @description
 * Provides a scheduled task that runs every 30 seconds to detect all PENDING
 * payments whose expiry date has passed. For each expired payment it updates
 * the status to EXPIRED and emits a PaymentExpiredMessage to Kafka in parallel,
 * then logs the count and execution duration.
 *
 * @class PaymentsScheduler
 *
 * @example
 * // The scheduler is automatically invoked by NestJS scheduling.
 * // No manual invocation is required.
 */
@Injectable()
export class PaymentsScheduler {
  /**
   * Logger instance for the scheduler.
   *
   * @private
   * @readonly
   */
  private readonly logger = new Logger(PaymentsScheduler.name);

  /**
   * Creates an instance of PaymentsScheduler.
   *
   * @param {PaymentsRepository} paymentsRepository - Repository for payment database operations.
   * @param {PaymentsProducer} paymentsProducer - Producer for emitting payment events to Kafka.
   *
   * @example
   * // The scheduler is typically instantiated by NestJS dependency injection
   * const scheduler = new PaymentsScheduler(paymentsRepository, paymentsProducer);
   */
  constructor(
    private readonly paymentsRepository: PaymentsRepository,
    private readonly paymentsProducer: PaymentsProducer,
  ) {}

  /**
   * Handles the expiration of pending payments.
   *
   * @description
   * This scheduled task runs every 30 seconds to check for PENDING payments
   * whose expiresAt timestamp has elapsed. For each expired payment, it updates
   * the payment status to EXPIRED and emits a payment expired event to Kafka
   * in parallel. Logs the number of processed payments and total execution time
   * when at least one expired payment is found.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when all expired payments have been processed.
   *
   * @example
   * // This method is automatically invoked by the scheduler every 30 seconds.
   * // It processes expired payments as follows:
   * // 1. Fetches all PENDING payments past their expiresAt from the database
   * // 2. For each payment:
   * //    - Updates the payment status to EXPIRED
   * //    - Sends a payment expired event to Kafka
   * // 3. Logs the number of processed payments and execution time
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  @Transactional()
  async handleExpiredPayments() {
    const startTime = performance.now();

    const expiredPayments = await this.paymentsRepository.listExpiredPayments();

    for (const payment of expiredPayments) {
      await Promise.all([
        this.paymentsRepository.update(payment.id, {
          status: PaymentStatus.EXPIRED,
        }),
        this.paymentsProducer.sendPaymentExpiredEvent({
          id: payment.id,
          userId: payment.userId,
          amountInCents: payment.amountInCents,
          expiresAt: payment.expiresAt,
          externalId: payment.externalId,
          expiredAt: new Date(),
        }),
      ]);
    }

    if (expiredPayments.length > 0) {
      this.logger.debug(
        `Found ${expiredPayments.length} expired payments, processed in: ${performance.now() - startTime}ms`,
      );
    }
  }
}
