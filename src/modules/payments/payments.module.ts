/**
 * @fileoverview NestJS module for payments management.
 *
 * @description
 * This file contains the PaymentsModule class which encapsulates all
 * functionality related to payment processing, including HTTP endpoints,
 * Kafka event consumers, scheduled tasks, and repository access.
 *
 * @module payments.module
 */

import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../shared/database/database.module';
import { CacheModule } from '../../shared/cache/cache.module';
import {
  PaymentsReservationCreatedConsumer,
  PaymentsSessionSeatReservationConflictConsumer,
} from './events/consumers';
import { PaymentsUseCases } from './use-cases';
import { PaymentsService } from './services/payments.service';
import { PaymentsRepository } from './repositories/payments.repository';
import { PaymentsScheduler } from './schedulers';
import { PaymentsProducer } from './events/producers';
import { SessionsCoreModule } from '../sessions/core/sessions-core.module';
import { PaymentsController } from './controllers/payments.controller';

/**
 * Module for managing payments.
 *
 * @description
 * Provides all necessary components for payment operations including:
 * - HTTP controller for payment endpoints
 * - Kafka consumer for reservation created events
 * - Use cases encapsulating payment business logic
 * - Service orchestrating use case execution
 * - Repository for database persistence
 * - Producer for emitting payment Kafka events
 * - Scheduler for marking expired payments
 *
 * @class PaymentsModule
 *
 * @example
 * // Import in AppModule
 * import { PaymentsModule } from './modules/payments/payments.module';
 *
 * @Module({
 *   imports: [PaymentsModule],
 * })
 * export class AppModule {}
 */
@Module({
  imports: [DatabaseModule, SessionsCoreModule, CacheModule],
  controllers: [
    // Consumers
    PaymentsReservationCreatedConsumer,
    PaymentsSessionSeatReservationConflictConsumer,
    // Controllers
    PaymentsController,
  ],
  providers: [
    // Use cases
    ...PaymentsUseCases,
    // Services
    PaymentsService,
    // Repositories
    PaymentsRepository,

    // Producers
    PaymentsProducer,
    // Schedulers
    PaymentsScheduler,
  ],
})
export class PaymentsModule {}
