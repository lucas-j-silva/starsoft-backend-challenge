import { Injectable } from '@nestjs/common';
import { CacheClientService } from './cache-client.service';
import { Redlock, RedlockInstance } from '@redis-kit/lock';
import { RedisClientType } from 'redis';

@Injectable()
export class CacheLockService {
  private redlock: Redlock;

  constructor(private readonly cacheClientService: CacheClientService) {
    this.redlock = new Redlock(
      [this.cacheClientService.getInstance() as unknown as RedisClientType],
      {
        maxRetryAttempts: 25,
        retryDelayMs: 100,
      },
    );
  }

  async acquireLock(
    resource: string,
    ttl: number,
  ): Promise<RedlockInstance | null> {
    return await this.redlock.acquire(resource, ttl);
  }

  // async releaseLock(lock: Lock): Promise<void> {
  //   return await this.redlock.release(lock);
  // }
}
