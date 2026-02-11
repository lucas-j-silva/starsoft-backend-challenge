/**
 * @fileoverview Main sessions module that aggregates all session-related functionality.
 *
 * @description
 * This module serves as the entry point for all session-related features,
 * combining the core sessions functionality with session seats management.
 * It re-exports both SessionsCoreModule and SessionSeatsModule to provide
 * a unified interface for session operations.
 *
 * @module sessions
 */

import { Module } from '@nestjs/common';
import { SessionsCoreModule } from './core/sessions-core.module';
import { SessionSeatsModule } from './seats/session-seats.module';

/**
 * Main module for session management.
 *
 * @description
 * Aggregates all session-related modules including core session operations
 * and session seats management. Import this module to access all session
 * functionality in your application.
 *
 * @class SessionsModule
 *
 * @example
 * ```typescript
 * // Import in AppModule or feature module
 * @Module({
 *   imports: [SessionsModule],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [SessionsCoreModule, SessionSeatsModule],
})
export class SessionsModule {}
