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

@Injectable()
export class CacheClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheClientService.name);
  private client: RedisClientType | RedisClusterType | RedisSentinelType;

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

  getInstance(): RedisClientType | RedisClusterType | RedisSentinelType {
    return this.client;
  }

  private async connect(): Promise<void> {
    console.log('a1', this.client.connect);
    await this.client.connect();
    console.log('a2');
  }

  private disconnect(): void {
    this.client.destroy();
  }

  async onModuleInit() {
    await this.connect();
    this.logger.debug('Redis client connected');
  }

  onModuleDestroy() {
    this.disconnect();
    this.logger.debug('Redis client disconnected');
  }
}
