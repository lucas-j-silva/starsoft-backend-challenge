import { Module } from '@nestjs/common';
import { DRIZZLE_PROVIDER } from './database.provider';

@Module({
  imports: [],
  providers: [DRIZZLE_PROVIDER],
  exports: [DRIZZLE_PROVIDER],
})
export class DatabaseModule {}
