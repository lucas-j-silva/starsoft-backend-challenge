/**
 * @fileoverview NestJS module for rooms and seats management.
 *
 * @description
 * This file contains the RoomsModule which encapsulates all room and seat
 * related functionality including controllers, services, repositories,
 * and use cases. It serves as the main entry point for room management
 * features in the application.
 *
 * @module rooms.module
 */

import { DatabaseModule } from '../../shared/database/database.module';
import { RoomsUseCases, SeatsUseCases } from './use-cases';
import { RoomsRepository, SeatsRepository } from './repositories';
import { RoomsService, SeatsService } from './services';
import { Module } from '@nestjs/common';
import { RoomsController, SeatsController } from './controllers';

/**
 * NestJS module for managing rooms and their associated seats.
 *
 * @description
 * This module provides comprehensive functionality for room and seat management,
 * including CRUD operations, pagination, and business logic through use cases.
 * It imports the DatabaseModule for data persistence and exports services
 * and use cases for use by other modules.
 *
 * @class RoomsModule
 *
 * @example
 * // Import RoomsModule in your application module
 * import { RoomsModule } from './modules/rooms/rooms.module';
 *
 * @Module({
 *   imports: [RoomsModule],
 * })
 * export class AppModule {}
 */
@Module({
  /** External modules required by this module */
  imports: [DatabaseModule],
  /** HTTP controllers handling room and seat endpoints */
  controllers: [RoomsController, SeatsController],
  /** Injectable providers including repositories, services, and use cases */
  providers: [
    RoomsRepository,
    ...RoomsUseCases,
    RoomsService,
    ...SeatsUseCases,
    SeatsRepository,
    SeatsService,
  ],
  /** Providers exported for use by other modules */
  exports: [...RoomsUseCases, RoomsService, ...SeatsUseCases, SeatsService],
})
export class RoomsModule {}
