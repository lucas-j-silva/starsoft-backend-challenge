/**
 * @fileoverview NestJS module for session seats management.
 *
 * @description
 * This module encapsulates all functionality related to session seats,
 * including seat reservations, availability management, caching, and
 * event-driven operations. It provides controllers, services, repositories,
 * and schedulers for comprehensive session seat handling.
 *
 * @module session-seats.module
 */

import { Module } from '@nestjs/common';
import { CacheModule } from 'src/shared/cache/cache.module';
import { DatabaseModule } from 'src/shared/database/database.module';
import { SessionSeatsController } from './controllers';
import { SessionSeatsUseCases } from './use-cases';
import {
  SessionSeatReservationsRepository,
  SessionSeatsRepository,
} from './repositories';
import { SessionSeatsService } from './services';
import { SessionSeatsCacheService } from './cache/services';
import { SessionSeatsProducer } from './events/producers';
import { SessionSeatScheduler } from './schedulers/session-seat.scheduler';

/**
 * Module for managing session seats and reservations.
 *
 * @description
 * Provides all necessary components for session seat operations including:
 * - Controllers for handling HTTP requests
 * - Use cases for business logic
 * - Repositories for data persistence
 * - Cache services for performance optimization
 * - Event producers for messaging
 * - Schedulers for background tasks
 *
 * @class SessionSeatsModule
 *
 * @example
 * // Import in another module
 * import { SessionSeatsModule } from './modules/sessions/seats/session-seats.module';
 *
 * @Module({
 *   imports: [SessionSeatsModule],
 * })
 * export class AppModule {}
 */
@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [SessionSeatsController],
  providers: [
    ...SessionSeatsUseCases,
    SessionSeatsRepository,
    SessionSeatReservationsRepository,
    SessionSeatsCacheService,
    SessionSeatsService,
    SessionSeatsProducer,
    SessionSeatScheduler,
  ],
  exports: [
    ...SessionSeatsUseCases,
    SessionSeatsRepository,
    SessionSeatReservationsRepository,
    SessionSeatsCacheService,
    SessionSeatsService,
    SessionSeatsProducer,
  ],
})
export class SessionSeatsModule {}
