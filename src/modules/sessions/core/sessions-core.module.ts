/**
 * @fileoverview Core module for sessions functionality.
 *
 * @description
 * This file contains the NestJS module definition for the sessions core feature.
 * It configures and exports all session-related use cases, repositories, services,
 * and controllers required for session management operations.
 *
 * @module sessions-core.module
 */

import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { SessionsUseCases } from './use-cases';
import { SessionsRepository } from './repositories';
import { SessionsService } from './services';
import { SessionsController } from './controllers';
import { RoomsModule } from 'src/modules/rooms/rooms.module';
import { MoviesModule } from 'src/modules/movies/movies.module';
import { SessionSeatsModule } from '../seats/session-seats.module';

/**
 * Core module for session management.
 *
 * @description
 * This module encapsulates all core session functionality including:
 * - Session CRUD operations via use cases
 * - Data persistence through the sessions repository
 * - Business logic coordination via the sessions service
 * - HTTP endpoint handling through the sessions controller
 *
 * @class SessionsCoreModule
 *
 * @example
 * // Import in another module
 * import { SessionsCoreModule } from 'src/modules/sessions/core/sessions-core.module';
 *
 * @Module({
 *   imports: [SessionsCoreModule],
 * })
 * export class AppModule {}
 */
@Module({
  imports: [SessionSeatsModule, RoomsModule, MoviesModule, DatabaseModule],
  controllers: [SessionsController],
  providers: [...SessionsUseCases, SessionsRepository, SessionsService],
  exports: [...SessionsUseCases, SessionsRepository, SessionsService],
})
export class SessionsCoreModule {}
