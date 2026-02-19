/**
 * @fileoverview Redis client service supporting sentinel, cluster, and standalone modes.
 *
 * @description
 * This file contains CacheClientService, which manages the lifecycle of a Redis
 * connection. The connection mode is determined at construction time by reading
 * environment variables: REDIS_SENTINEL_NODES takes precedence, followed by
 * REDIS_CLUSTER_NODES, and finally a plain REDIS_URL for standalone mode.
 *
 * @module cache-client.service
 */

import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createClient,
  createCluster,
  createSentinel,
  type RedisClusterType,
  type RedisClientType,
  type RedisSentinelType,
} from 'redis';

/**
 * NestJS service that manages a Redis client connection.
 *
 * @description
 * Determines the Redis topology at construction time based on environment
 * variables and provides a single shared client instance to the rest of the
 * application. Three modes are supported:
 *
 * - **Sentinel** – when `REDIS_SENTINEL_NODES` is set (comma-separated
 *   `host:port` list). Uses `REDIS_SENTINEL_NAME` (default: `"mymaster"`) as
 *   the master name.
 * - **Cluster** – when `REDIS_CLUSTER_NODES` is set (comma-separated
 *   `host:port` list). Replica reads are enabled.
 * - **Standalone** – falls back to a plain `REDIS_URL`.
 *
 * Connection is established in `onModuleInit` and torn down in
 * `onModuleDestroy`.
 *
 * @class CacheClientService
 * @implements {OnModuleInit}
 * @implements {OnModuleDestroy}
 * @decorator Injectable
 *
 * @example
 * // Inject and retrieve the underlying client
 * constructor(private readonly cacheClient: CacheClientService) {}
 *
 * const client = this.cacheClient.getInstance();
 * await client.set('key', 'value');
 */
@Injectable()
export class CacheClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheClientService.name);

  /**
   * The active Redis client instance.
   *
   * @private
   * @type {RedisClientType | RedisClusterType | RedisSentinelType}
   * @memberof CacheClientService
   */
  private client: RedisClientType | RedisClusterType | RedisSentinelType;

  /**
   * Creates an instance of CacheClientService and selects the Redis topology.
   *
   * @description
   * Reads environment variables to decide which Redis connection mode to use.
   * The selection order is: sentinel → cluster → standalone.
   *
   * @param {ConfigService} configService - NestJS configuration service used to
   *   read REDIS_SENTINEL_NODES, REDIS_CLUSTER_NODES, REDIS_SENTINEL_NAME, and
   *   REDIS_URL environment variables.
   *
   * @example
   * // Instantiated automatically by NestJS DI; no manual construction needed.
   * const service = new CacheClientService(configService);
   */
  constructor(private readonly configService: ConfigService) {
    const sentinelNodes = this.configService.get<string>(
      'REDIS_SENTINEL_NODES',
    );
    const clusterNodes = this.configService.get<string>('REDIS_CLUSTER_NODES');

    if (sentinelNodes) {
      const sentinelName =
        this.configService.get<string>('REDIS_SENTINEL_NAME') ?? 'mymaster';
      const sentinelRootNodes = sentinelNodes.split(',').map((node) => {
        const [host, port] = node.trim().split(':');
        return { host, port: parseInt(port, 10) };
      });
      this.client = createSentinel({ name: sentinelName, sentinelRootNodes });
      this.logger.debug(
        `Redis sentinel mode: ${sentinelRootNodes.length} sentinels, master "${sentinelName}"`,
      );
    } else if (clusterNodes) {
      const rootNodes = clusterNodes
        .split(',')
        .map((node) => ({ url: `redis://${node.trim()}` }));
      // RedisClusterType exposes the same command surface (set/get/eval/pExpireAt)
      // used throughout this codebase. The cast avoids cascading type changes downstream.
      this.client = createCluster({ rootNodes, useReplicas: true });
      this.logger.debug(`Redis cluster mode: ${rootNodes.length} root nodes`);
    } else {
      this.client = createClient({
        url: this.configService.getOrThrow<string>('REDIS_URL'),
      });
      this.logger.debug('Redis standalone mode');
    }
  }

  /**
   * Returns the active Redis client instance.
   *
   * @description
   * Exposes the underlying redis client so that other services (e.g.
   * {@link CacheLockService}) can use it directly. The concrete type depends on
   * which connection mode was selected at construction time.
   *
   * @returns {RedisClientType | RedisClusterType | RedisSentinelType} The
   *   active Redis client.
   *
   * @example
   * const client = cacheClientService.getInstance();
   * const value = await client.get('my-key');
   */
  getInstance(): RedisClientType | RedisClusterType | RedisSentinelType {
    return this.client;
  }

  /**
   * Opens the Redis connection.
   *
   * @description
   * Called internally by {@link onModuleInit}. Delegates to the underlying
   * client's `connect()` method.
   *
   * @async
   * @private
   * @returns {Promise<void>} Resolves once the connection is established.
   * @throws {Error} If the Redis server is unreachable or connection fails.
   *
   * @memberof CacheClientService
   */
  private async connect(): Promise<void> {
    await this.client.connect();
  }

  /**
   * Closes the Redis connection.
   *
   * @description
   * Called internally by {@link onModuleDestroy}. Delegates to the underlying
   * client's `destroy()` method for an immediate teardown without waiting for
   * in-flight commands.
   *
   * @private
   * @returns {void}
   *
   * @memberof CacheClientService
   */
  private disconnect(): void {
    this.client.destroy();
  }

  /**
   * NestJS lifecycle hook — connects to Redis when the module initialises.
   *
   * @async
   * @returns {Promise<void>} Resolves once the connection is ready.
   * @throws {Error} If the connection cannot be established.
   *
   * @memberof CacheClientService
   */
  async onModuleInit() {
    await this.connect();
    this.logger.debug('Redis client connected');
  }

  /**
   * NestJS lifecycle hook — disconnects from Redis when the module is destroyed.
   *
   * @returns {void}
   *
   * @memberof CacheClientService
   */
  onModuleDestroy() {
    this.disconnect();
    this.logger.debug('Redis client disconnected');
  }
}
