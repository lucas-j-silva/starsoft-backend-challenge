/**
 * @fileoverview NestJS module that provides and exports the Drizzle ORM database provider.
 *
 * @description
 * This module registers the DRIZZLE_PROVIDER factory token so that other
 * modules can inject the configured Drizzle database client via the
 * {@link InjectDatabase} decorator or NestJS's standard `@Inject(DB_PROVIDER)`.
 *
 * @module database.module
 */

import { Module } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from './database.provider';

/**
 * NestJS module for shared database infrastructure.
 *
 * @description
 * Registers the {@link DRIZZLE_PROVIDER} factory provider and re-exports it
 * so that any feature module which imports DatabaseModule can inject the
 * Drizzle ORM client directly.
 *
 * @class DatabaseModule
 * @decorator Module
 *
 * @example
 * // Import DatabaseModule in a feature module
 * @Module({
 *   imports: [DatabaseModule],
 * })
 * export class FeatureModule {}
 */
@Module({
  imports: [],
  providers: [DRIZZLE_PROVIDER],
  exports: [DRIZZLE_PROVIDER],
})
export class DatabaseModule {}
