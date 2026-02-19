/* eslint-disable @typescript-eslint/no-misused-promises */
import { randomUUID } from 'crypto';
import { EventEmitter } from 'events';
import { RedisClientType, RedisClusterType } from 'redis';

/**
 * Represents a distributed lock acquired on a Redis resource.
 *
 * @interface Lock
 * @property {string} resource - The unique identifier of the locked resource.
 * @property {string} value - The unique value used to identify the lock owner.
 * @property {number} ttl - The time-to-live timestamp (in milliseconds since epoch) when the lock expires.
 */
export interface Lock {
  resource: string;
  value: string;
  ttl: number;
}

/**
 * A distributed lock manager implementation using Redis.
 *
 * @description
 * Provides distributed locking capabilities using Redis as the backend store.
 * Implements a simplified version of the Redlock algorithm for single-node Redis setups.
 * Supports lock acquisition with retries, lock renewal, and automatic lock extension.
 *
 * @class Redlock
 * @extends {EventEmitter}
 *
 * @fires Redlock#acquired - Emitted when a lock is successfully acquired.
 * @fires Redlock#released - Emitted when a lock is released.
 * @fires Redlock#renewed - Emitted when a lock is successfully renewed.
 * @fires Redlock#clientError - Emitted when a Redis client error occurs.
 * @fires Redlock#error - Emitted when a general error occurs (e.g., auto-extend failure).
 *
 * @example
 * // Basic usage
 * const redlock = new Redlock(redisClient, 3, 200);
 *
 * const lock = await redlock.acquireLock('my-resource', 5000);
 * if (lock) {
 *   try {
 *     // Do work while holding the lock
 *   } finally {
 *     await redlock.releaseLock(lock.resource, lock.value);
 *   }
 * }
 *
 * @example
 * // Using the `using` helper for automatic lock management
 * const result = await redlock.using('my-resource', 5000, async (lock) => {
 *   // Do work while holding the lock
 *   return 'result';
 * }, { autoExtend: true });
 */
export class Redlock extends EventEmitter {
  /**
   * The Redis client instance used for lock operations.
   * @private
   */
  private client: RedisClientType | RedisClusterType;

  /**
   * The number of retry attempts when acquiring a lock.
   * @private
   * @type {number}
   */
  private retryCount: number;

  /**
   * The delay in milliseconds between retry attempts.
   * @private
   * @type {number}
   */
  private retryDelay: number;

  /**
   * Creates an instance of Redlock.
   *
   * @constructor
   * @param client - The Redis client to use for lock operations.
   * @param {number} [retryCount=3] - The number of times to retry acquiring a lock before giving up.
   * @param {number} [retryDelay=200] - The delay in milliseconds between retry attempts.
   *
   * @example
   * const redlock = new Redlock(redisClient, 5, 100);
   */
  constructor(
    client: RedisClientType | RedisClusterType,
    retryCount = 3,
    retryDelay = 200,
  ) {
    super();
    this.client = client;
    this.retryCount = retryCount;
    this.retryDelay = retryDelay;
  }

  /**
   * Attempts to acquire a lock on a single Redis client.
   *
   * @description
   * Uses Redis SET command with NX (only set if not exists) and PX (expiration in milliseconds)
   * options to atomically acquire a lock.
   *
   * @private
   * @param {string} resource - The resource identifier to lock.
   * @param {string} value - The unique lock value (used to identify the lock owner).
   * @param {number} ttl - The time-to-live for the lock in milliseconds.
   * @returns {Promise<boolean>} A promise that resolves to true if the lock was acquired, false otherwise.
   *
   * @emits Redlock#clientError - When a Redis client error occurs.
   */
  private async acquireLockInstance(
    resource: string,
    value: string,
    ttl: number,
  ): Promise<boolean> {
    try {
      const result = await this.client.set(resource, value, {
        NX: true,
        PX: ttl,
      });
      return result === 'OK';
    } catch (error) {
      this.emit('clientError', error);
      return false;
    }
  }

  /**
   * Releases a lock on a single Redis client using a Lua script.
   *
   * @description
   * Uses a Lua script to atomically check if the lock value matches before deleting.
   * This prevents accidentally releasing a lock that was acquired by another process.
   *
   * @private
   * @param {Lock} lock - The lock object containing resource and value to release.
   * @returns {Promise<number>} A promise that resolves to the number of keys that were removed (0 or 1).
   *
   * @emits Redlock#clientError - When a Redis client error occurs.
   */
  private releaseLockInstance(lock: Lock): Promise<number> {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    return this.client
      .eval(script, { keys: [lock.resource], arguments: [lock.value] })
      .catch((error) => {
        this.emit('clientError', error);
        return 0;
      }) as unknown as Promise<number>;
  }

  /**
   * Attempts to acquire a lock on the specified resource with automatic retries.
   *
   * @description
   * Generates a unique lock value using UUID and attempts to acquire the lock.
   * If acquisition fails, it retries up to `retryCount` times with `retryDelay` milliseconds
   * between attempts.
   *
   * @public
   * @param {string} resource - The resource identifier to lock.
   * @param {number} ttl - The time-to-live for the lock in milliseconds.
   * @returns {Promise<Lock | null>} A promise that resolves to the acquired lock object,
   *                                  or null if the lock could not be acquired after all retries.
   *
   * @emits Redlock#acquired - When the lock is successfully acquired.
   *
   * @example
   * const lock = await redlock.acquireLock('orders:123', 5000);
   * if (lock) {
   *   console.log('Lock acquired:', lock.resource);
   * }
   */
  public async acquireLock(
    resource: string,
    ttl: number,
  ): Promise<Lock | null> {
    const value = randomUUID(); // Unique lock value
    const end = Date.now() + ttl;

    for (let i = 0; i < this.retryCount; i++) {
      const isSuccess = await this.tryAcquire(resource, value, ttl);

      if (isSuccess) {
        const lock = { resource, value, ttl: end };
        this.emit('acquired', lock);

        return lock;
      }

      await this.releaseLock(resource, value);

      await this.sleep(this.retryDelay);
    }

    return null;
  }

  /**
   * Attempts to acquire a lock on the specified resource using a custom retry strategy.
   *
   * @description
   * Similar to `acquireLock`, but allows specifying a custom function to determine
   * the delay between retry attempts. This enables implementing exponential backoff
   * or other custom retry patterns.
   *
   * @public
   * @param {string} resource - The resource identifier to lock.
   * @param {number} ttl - The time-to-live for the lock in milliseconds.
   * @param {(attempt: number) => number} retryStrategy - A function that receives the current
   *                                                       attempt number (0-indexed) and returns
   *                                                       the delay in milliseconds before the next retry.
   * @returns {Promise<Lock | null>} A promise that resolves to the acquired lock object,
   *                                  or null if the lock could not be acquired after all retries.
   *
   * @emits Redlock#acquired - When the lock is successfully acquired.
   *
   * @example
   * // Exponential backoff strategy
   * const lock = await redlock.acquireLockWithCustomRetry(
   *   'orders:123',
   *   5000,
   *   (attempt) => Math.min(100 * Math.pow(2, attempt), 3000)
   * );
   */
  public async acquireLockWithCustomRetry(
    resource: string,
    ttl: number,
    retryStrategy: (attempt: number) => number,
  ): Promise<Lock | null> {
    const value = randomUUID();
    const end = Date.now() + ttl;

    for (let i = 0; i < this.retryCount; i++) {
      const isSuccess = await this.tryAcquire(resource, value, ttl);

      if (isSuccess) {
        const lock = { resource, value, ttl: end };
        this.emit('acquired', lock);

        return lock;
      }

      await this.releaseLock(resource, value);
      await this.sleep(retryStrategy(i));
    }

    return null;
  }

  /**
   * Attempts to acquire a lock on the specified resource.
   *
   * @description
   * Internal helper method that wraps `acquireLockInstance` and converts
   * the result to a boolean, catching any errors.
   *
   * @private
   * @param {string} resource - The resource identifier to lock.
   * @param {string} value - The unique lock value.
   * @param {number} ttl - The time-to-live for the lock in milliseconds.
   * @returns {Promise<boolean>} A promise that resolves to true if the lock was acquired, false otherwise.
   */
  private async tryAcquire(
    resource: string,
    value: string,
    ttl: number,
  ): Promise<boolean> {
    return await this.acquireLockInstance(resource, value, ttl)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Releases a lock on the specified resource.
   *
   * @description
   * Releases a previously acquired lock by its resource identifier and value.
   * The value must match the original lock value to ensure only the lock owner
   * can release it.
   *
   * @public
   * @param {string} resource - The resource identifier to unlock.
   * @param {string} value - The unique lock value (must match the value used when acquiring).
   * @returns {Promise<void>} A promise that resolves when the lock has been released.
   *
   * @emits Redlock#released - When the lock is released.
   *
   * @example
   * await redlock.releaseLock('orders:123', lock.value);
   */
  public async releaseLock(resource: string, value: string): Promise<void> {
    const lock: Lock = { resource, value, ttl: 0 };

    await this.releaseLockInstance(lock);
    this.emit('released', lock);
  }

  /**
   * Renews (extends) a lock on the specified resource.
   *
   * @description
   * Extends the TTL of an existing lock using a Lua script that atomically
   * verifies ownership before extending. This is useful for long-running operations
   * that may exceed the original lock TTL.
   *
   * @public
   * @param {string} resource - The resource identifier of the lock to renew.
   * @param {string} value - The unique lock value (must match the current lock owner).
   * @param {number} ttl - The new time-to-live for the lock in milliseconds.
   * @returns {Promise<boolean>} A promise that resolves to true if the lock was renewed,
   *                              false if the lock doesn't exist or is owned by another process.
   *
   * @emits Redlock#renewed - When the lock is successfully renewed.
   * @emits Redlock#clientError - When a Redis client error occurs.
   *
   * @example
   * const renewed = await redlock.renewLock('orders:123', lock.value, 5000);
   * if (!renewed) {
   *   console.log('Lock was lost or expired');
   * }
   */
  public async renewLock(
    resource: string,
    value: string,
    ttl: number,
  ): Promise<boolean> {
    const script = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("pexpire", KEYS[1], ARGV[2])
    else
      return 0
    end
  `;

    const result = (await this.client
      .eval(script, {
        keys: [resource],
        arguments: [value, ttl.toString()],
      })
      .catch((error) => {
        this.emit('clientError', error);
        return 0;
      })) as unknown as number;

    const isSuccess = result === 1;

    if (isSuccess) {
      this.emit('renewed', { resource, value, ttl });
    }

    return isSuccess;
  }

  /**
   * Acquires a lock, executes a routine, and automatically releases the lock.
   *
   * @description
   * A convenience method that handles the full lock lifecycle: acquisition,
   * execution of the provided routine, and release. Optionally supports
   * automatic lock extension at 80% of the TTL interval to prevent lock
   * expiration during long-running operations.
   *
   * @public
   * @template T - The return type of the routine function.
   * @param {string} resource - The resource identifier to lock.
   * @param {number} ttl - The time-to-live for the lock in milliseconds.
   * @param {(lock: Lock) => Promise<T>} routine - The async function to execute while holding the lock.
   *                                                Receives the lock object as a parameter.
   * @param {Object} [options] - Optional configuration options.
   * @param {boolean} [options.autoExtend] - If true, automatically extends the lock at 80% of TTL.
   * @returns {Promise<T>} A promise that resolves to the result of the routine.
   * @throws {Error} Throws an error if the lock cannot be acquired.
   *
   * @emits Redlock#error - When auto-extend fails to renew the lock.
   *
   * @example
   * // Basic usage
   * const result = await redlock.using('orders:123', 5000, async (lock) => {
   *   // Perform operations while holding the lock
   *   return await processOrder(orderId);
   * });
   *
   * @example
   * // With auto-extend for long-running operations
   * const result = await redlock.using('reports:daily', 30000, async (lock) => {
   *   return await generateLargeReport();
   * }, { autoExtend: true });
   */
  public async using<T>(
    resource: string,
    ttl: number,
    routine: (lock: Lock) => Promise<T>,
    options?: { autoExtend?: boolean },
  ): Promise<T> {
    const lock = await this.acquireLock(resource, ttl);
    if (!lock) {
      throw new Error(`Failed to acquire lock for resource: ${resource}`);
    }

    let extensionTimer: NodeJS.Timeout | null = null;

    if (options?.autoExtend) {
      const extendInterval = Math.floor(ttl * 0.8); // Extend at 80% of TTL
      extensionTimer = setInterval(async () => {
        try {
          const renewed = await this.renewLock(lock.resource, lock.value, ttl);
          if (!renewed) {
            this.emit(
              'error',
              new Error(`Failed to auto-extend lock for resource: ${resource}`),
            );
            if (extensionTimer) clearInterval(extensionTimer);
          }
        } catch (error) {
          this.emit('error', error);
        }
      }, extendInterval);
    }

    try {
      return await routine(lock);
    } finally {
      if (extensionTimer) {
        clearInterval(extensionTimer);
      }
      await this.releaseLock(lock.resource, lock.value);
    }
  }

  /**
   * Sleeps for the specified number of milliseconds.
   *
   * @description
   * A utility method that returns a promise that resolves after the specified delay.
   * Used internally for implementing retry delays.
   *
   * @private
   * @param {number} ms - The number of milliseconds to sleep.
   * @returns {Promise<void>} A promise that resolves after the specified delay.
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
