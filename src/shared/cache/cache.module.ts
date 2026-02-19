/**
 * @fileoverview NestJS module that provides and exports cache-related services.
 *
 * @description
 * This module registers CacheClientService and CacheLockService as providers
 * and re-exports them so that any module importing CacheModule can inject
 * these services directly.
 *
 * @module cache.module
 */

import { Module } from '@nestjs/common';
import { CacheClientService } from './cache-client.service';
import { CacheLockService } from './cache-lock.service';

/**
 * NestJS module for shared cache infrastructure.
 *
 * @description
 * Registers and exports {@link CacheClientService} (Redis connection management)
 * and {@link CacheLockService} (distributed locking via Redlock) so that
 * consuming modules can use either service through dependency injection.
 *
 * @class CacheModule
 * @decorator Module
 *
 * @example
 * // Import CacheModule in a feature module
 * @Module({
 *   imports: [CacheModule],
 * })
 * export class FeatureModule {}
 */
@Module({
  providers: [CacheClientService, CacheLockService],
  exports: [CacheClientService, CacheLockService],
})
export class CacheModule {}
