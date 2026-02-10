import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, type RedisClientType } from 'redis';

@Injectable()
export class CacheClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CacheClientService.name);
  private client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.getOrThrow<string>('REDIS_URL'),
    });
  }

  getInstance(): RedisClientType {
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
