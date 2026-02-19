/**
 * @fileoverview Drizzle ORM provider, injection token, and shared type aliases.
 *
 * @description
 * This file defines:
 * - `DB_PROVIDER` – the string injection token used throughout the codebase to
 *   reference the Drizzle client in NestJS's DI container.
 * - `DRIZZLE_PROVIDER` – a NestJS `FactoryProvider` that reads `DATABASE_URL`
 *   from the environment via `ConfigService` and returns a configured Drizzle
 *   ORM client for PostgreSQL.
 * - `DatabaseClient` – type alias for the return type of `drizzle()`.
 * - `DatabaseTransactionAdapter` – type alias for the CLS transactional adapter
 *   used with `@nestjs-cls/transactional-adapter-drizzle-orm`.
 *
 * A query logger is available but commented out; it can be re-enabled by
 * uncommenting the logger block inside the factory.
 *
 * @module database.provider
 */

import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { ConfigService } from '@nestjs/config';
import { withReplicas } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/node-postgres';

/**
 * NestJS injection token for the Drizzle ORM database client.
 *
 * @description
 * Use this constant with `@Inject(DB_PROVIDER)` or, preferably, with the
 * {@link InjectDatabase} convenience decorator.
 *
 * @constant {string}
 */
export const DB_PROVIDER = 'DB_PROVIDER';

//  const logger = new Logger(DB_PROVIDER);

/**
 * NestJS factory provider that creates and configures the Drizzle ORM client.
 *
 * @description
 * Reads the `DATABASE_URL` environment variable via `ConfigService` and passes
 * it to Drizzle's `drizzle()` factory for a `node-postgres` connection. The
 * resulting client is bound to the {@link DB_PROVIDER} token.
 *
 * An optional query logger (commented out) can be re-enabled inside the
 * factory to log all SQL statements and their parameters at the `debug` level.
 *
 * @example
 * // Registered in DatabaseModule:
 * @Module({ providers: [DRIZZLE_PROVIDER], exports: [DRIZZLE_PROVIDER] })
 * export class DatabaseModule {}
 */
export const DRIZZLE_PROVIDER = {
  provide: DB_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const primaryUrl = configService.getOrThrow<string>('DATABASE_URL');
    const replicaUrl = configService.get<string>('DATABASE_REPLICA_URL');

    const primary = drizzle(primaryUrl, {
      // logger: {
      //   logQuery(query, params) {
      //     logger.debug(
      //       params?.length ? `${query} | [${params.join(', ')}]` : query,
      //     );
      //   },
      // },
    });

    if (replicaUrl) {
      return withReplicas(primary, [drizzle(replicaUrl)]);
    }

    return primary;
  },
  inject: [ConfigService],
};

/**
 * Type alias for the Drizzle ORM client returned by the `DRIZZLE_PROVIDER` factory.
 */
export type DatabaseClient = ReturnType<typeof drizzle>;

/**
 * Type alias for the CLS transactional adapter used with Drizzle ORM.
 *
 * @description
 * Used when registering `ClsPluginTransactional` with
 * `@nestjs-cls/transactional-adapter-drizzle-orm` to ensure that all
 * repository operations participate in the same database transaction.
 */
export type DatabaseTransactionAdapter =
  TransactionalAdapterDrizzleOrm<DatabaseClient>;
