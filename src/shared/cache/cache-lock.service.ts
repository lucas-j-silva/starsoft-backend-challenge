/**
 * @fileoverview Distributed lock service built on Redlock.
 *
 * @description
 * This file contains CacheLockService, which wraps the Redlock algorithm to
 * provide distributed mutual exclusion across multiple application replicas.
 * It is configured with 25 maximum retry attempts and a 100 ms delay between
 * retries, giving callers a generous window to acquire a contested lock.
 *
 * @module cache-lock.service
 */

import { Injectable } from '@nestjs/common';
import { CacheClientService } from './cache-client.service';
import { Redlock, RedlockInstance } from '@redis-kit/lock';
import { RedisClientType } from 'redis';

/**
 * NestJS service that provides distributed locking via Redlock.
 *
 * @description
 * Uses a single Redis client (obtained from {@link CacheClientService}) to
 * instantiate a Redlock instance. Callers can acquire a named lock for a given
 * TTL; if the lock cannot be acquired within the configured retry window the
 * method returns `null` instead of throwing.
 *
 * Configuration defaults:
 * - `maxRetryAttempts`: 25
 * - `retryDelayMs`: 100 ms
 *
 * @class CacheLockService
 * @decorator Injectable
 *
 * @example
 * // Inject and acquire a lock
 * constructor(private readonly cacheLock: CacheLockService) {}
 *
 * const lock = await this.cacheLock.acquireLock('resource:seat:42', 5000);
 * if (lock) {
 *   try {
 *     // critical section
 *   } finally {
 *     await lock.release();
 *   }
 * }
 */
@Injectable()
export class CacheLockService {
  /**
   * The underlying Redlock instance used for distributed locking.
   *
   * @private
   * @type {Redlock}
   * @memberof CacheLockService
   */
  private redlock: Redlock;

  /**
   * Creates an instance of CacheLockService.
   *
   * @description
   * Initializes Redlock with the Redis client provided by
   * {@link CacheClientService}. The client is cast to `RedisClientType` to
   * satisfy the Redlock constructor signature — the actual runtime client may
   * also be a cluster or sentinel type.
   *
   * @param {CacheClientService} cacheClientService - Service that exposes the
   *   active Redis client instance.
   *
   * @example
   * // Instantiated automatically by NestJS DI; no manual construction needed.
   * const service = new CacheLockService(cacheClientService);
   */
  constructor(private readonly cacheClientService: CacheClientService) {
    this.redlock = new Redlock(
      [this.cacheClientService.getInstance() as unknown as RedisClientType],
      {
        maxRetryAttempts: 50,
        retryDelayMs: 50,
      },
    );
  }

  /**
   * Acquires a distributed lock for the given resource.
   *
   * @description
   * Delegates to Redlock's `acquire()` method. If the lock cannot be obtained
   * after the configured number of retries, `null` is returned rather than
   * propagating an error, allowing callers to handle contention gracefully.
   *
   * @async
   * @param {string} resource - A unique identifier for the resource to lock
   *   (e.g. `"locks:seat:550e8400"`).
   * @param {number} ttl - Lock time-to-live in milliseconds. The lock is
   *   automatically released by Redis after this duration even if the caller
   *   does not release it explicitly.
   * @returns {Promise<RedlockInstance | null>} The acquired lock instance, or
   *   `null` if the lock could not be obtained within the retry window.
   *
   * @example
   * const lock = await cacheLockService.acquireLock('locks:order:99', 3000);
   * if (!lock) {
   *   throw new Error('Could not acquire lock — resource is busy');
   * }
   * // perform guarded work ...
   * await lock.release();
   */
  async acquireLock(
    resource: string,
    ttl: number,
  ): Promise<RedlockInstance | null> {
    return await this.redlock.acquire(resource, ttl);
  }

  /**
   * Attempts to acquire a lightweight distributed lock for the given resource.
   *
   * @description
   * Uses a simple Redis SET with NX (only set if not exists) and PX (expiration
   * in milliseconds) options to acquire a lock. Unlike `acquireLock`, this method
   * does not use Redlock and does not retry — it immediately returns `null` if
   * the lock is already held by another process.
   *
   * This is useful for scenarios where you want a quick, non-blocking lock check
   * without the overhead of Redlock's retry mechanism.
   *
   * @async
   * @param {string} resource - A unique identifier for the resource to lock
   *   (e.g. `"locks:seat:550e8400"`).
   * @param {number} ttl - Lock time-to-live in milliseconds. The lock is
   *   automatically released by Redis after this duration even if the caller
   *   does not release it explicitly.
   * @returns {Promise<{ release: () => Promise<void> } | null>} An object with a
   *   `release` method to manually release the lock, or `null` if the lock could
   *   not be acquired (resource is already locked).
   *
   * @example
   * const lock = await cacheLockService.tryAcquireLock('locks:order:99', 3000);
   * if (!lock) {
   *   // Lock is already held — handle contention
   *   return;
   * }
   * try {
   *   // perform guarded work ...
   * } finally {
   *   await lock.release();
   * }
   */
  async tryAcquireLock(
    resource: string,
    ttl: number,
  ): Promise<{ release: () => Promise<void> } | null> {
    const client = this.cacheClientService.getInstance();
    const result = await client.set(resource, '1', { NX: true, PX: ttl });
    if (!result) return null;
    return {
      release: async () => {
        await client.del(resource);
      },
    };
  }
}
