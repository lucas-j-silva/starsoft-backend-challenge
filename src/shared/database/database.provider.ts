import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';

export const DB_PROVIDER = 'DB_PROVIDER';

//  const logger = new Logger(DB_PROVIDER);

export const DRIZZLE_PROVIDER = {
  provide: DB_PROVIDER,
  useFactory: (configService: ConfigService) => {
    return drizzle(configService.getOrThrow<string>('DATABASE_URL'), {
      // logger: {
      //   logQuery(query, params) {
      //     logger.debug(
      //       params?.length ? `${query} | [${params.join(', ')}]` : query,
      //     );
      //   },
      // },
    });
  },
  inject: [ConfigService],
};

export type DatabaseClient = ReturnType<typeof drizzle>;
export type DatabaseTransactionAdapter =
  TransactionalAdapterDrizzleOrm<DatabaseClient>;
