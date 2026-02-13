import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { BetterAuth } from '../../shared/auth/better-auth';
import { DatabaseModule } from '../../shared/database/database.module';
import {
  DatabaseClient,
  DB_PROVIDER,
} from '../../shared/database/database.provider';

/**
 * Authentication module that integrates Better Auth with NestJS.
 *
 * This module configures the authentication system using the `@thallesp/nestjs-better-auth`
 * package, which provides a NestJS wrapper around Better Auth. It uses an async factory
 * pattern to inject the Drizzle database client for authentication data persistence.
 *
 * @module AuthModule
 *
 * @example
 * ```typescript
 * // Import in AppModule
 * import { AuthModule } from './modules/auth/auth.module';
 *
 * @Module({
 *   imports: [AuthModule],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [
    /**
     * Configures Better Auth module asynchronously with database integration.
     * Uses the DatabaseModule to provide the DrizzleClientService for
     * persisting authentication data (users, sessions, accounts, verifications).
     */
    BetterAuthModule.forRootAsync({
      /** Import DatabaseModule to make DrizzleClientService available */
      imports: [DatabaseModule],
      /**
       * Factory function that creates the Better Auth configuration.
       * @param drizzleClient - The Drizzle ORM client service
       * @returns Configuration object containing the Better Auth instance
       */
      useFactory: (client: DatabaseClient) => {
        return {
          auth: BetterAuth(client),
        };
      },
      /** Inject DrizzleClientService into the factory function */
      inject: [DB_PROVIDER],
    }),
  ],
})
export class AuthModule {}
