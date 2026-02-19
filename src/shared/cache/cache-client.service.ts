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
  type RedisClusterType,
  type RedisClientType,
} from 'redis';

@Injectable()
export class CacheClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheClientService.name);
  private client: RedisClientType | RedisClusterType;

  constructor(private readonly configService: ConfigService) {
    const clusterNodes = this.configService.get<string>('REDIS_CLUSTER_NODES');

    if (clusterNodes) {
      const rootNodes = clusterNodes
        .split(',')
        .map((node) => ({ url: `redis://${node.trim()}` }));

      // RedisClusterType exposes the same command surface (set/get/eval/pExpireAt)
      // used throughout this codebase. The cast avoids cascading type changes downstream.
      this.client = createCluster({ rootNodes });
      this.logger.debug(`Redis cluster mode: ${rootNodes.length} root nodes`);
    } else {
      this.client = createClient({
        url: this.configService.getOrThrow<string>('REDIS_URL'),
      });
      this.logger.debug('Redis standalone mode');
    }
  }

  getInstance(): RedisClientType | RedisClusterType {
    return this.client;
  }

  private async connect(): Promise<void> {
    await this.client.connect();
  }

  private async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  async onModuleInit() {
    await this.connect();
    this.logger.debug('Redis client connected');
  }

  async onModuleDestroy() {
    await this.disconnect();
    this.logger.debug('Redis client disconnected');
  }
}
