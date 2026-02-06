import { DrizzleClientService } from './drizzle-client.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [DrizzleClientService],
  exports: [DrizzleClientService],
})
export class DatabaseModule {}
