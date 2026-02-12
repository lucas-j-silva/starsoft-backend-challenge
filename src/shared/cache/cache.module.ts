import { Module } from '@nestjs/common';
import { CacheClientService } from './cache-client.service';
import { CacheLockService } from './cache-lock.service';

@Module({
  providers: [CacheClientService, CacheLockService],
  exports: [CacheClientService, CacheLockService],
})
export class CacheModule {}
