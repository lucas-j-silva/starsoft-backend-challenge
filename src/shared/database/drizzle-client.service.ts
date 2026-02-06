import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';

@Injectable()
export class DrizzleClientService {
  private client: NodePgDatabase;

  constructor(private readonly configService: ConfigService) {
    this.client = drizzle(configService.getOrThrow<string>('DATABASE_URL'));
  }

  getInstance(): NodePgDatabase {
    return this.client;
  }
}
