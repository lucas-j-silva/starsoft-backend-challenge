import { Module } from '@nestjs/common';
import { CacheClientService } from './cache-client.service';

@Module({
  providers: [CacheClientService],
  exports: [CacheClientService],
})
export class CacheModule {}
