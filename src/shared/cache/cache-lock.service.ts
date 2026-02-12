import { Injectable } from '@nestjs/common';
import { CacheClientService } from './cache-client.service';
import { Lock, Redlock } from './redlock';

@Injectable()
export class CacheLockService {
  private redlock: Redlock;

  constructor(private readonly cacheClientService: CacheClientService) {
    this.redlock = new Redlock(this.cacheClientService.getInstance(), 15, 200);
  }

  acquireLock(resource: string, ttl: number): Promise<Lock | null> {
    return this.redlock.acquireLock(resource, ttl);
  }

  releaseLock(resource: string, value: string): Promise<void> {
    return this.redlock.releaseLock(resource, value);
  }
}
