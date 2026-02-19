/**
 * @fileoverview Application auth factory built on better-auth.
 *
 * @description
 * This file exports BetterAuth, a factory function that creates and configures
 * the production better-auth instance. It wires together email/password
 * authentication, a Drizzle ORM adapter, session cookie caching, and the
 * OpenAPI plugin. The factory accepts an existing {@link DatabaseClient} so
 * that it can be integrated with NestJS dependency injection.
 *
 * @module better-auth
 */

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import {
  account,
  session,
  user,
  verification,
} from '../../modules/auth/schemas/auth.schema';
import { openAPI } from 'better-auth/plugins';
import { DatabaseClient } from '../database/database.provider';

/**
 * Factory function that creates the configured better-auth instance.
 *
 * @description
 * Accepts the application's Drizzle ORM client and returns a fully configured
 * better-auth instance with the following settings:
 *
 * - **Email & password** authentication enabled.
 * - **Drizzle adapter** using the provided `database` client and the
 *   application's auth schema tables (`user`, `session`, `account`,
 *   `verification`).
 * - **Session cookie cache** with a 1-minute TTL to reduce database round-trips.
 * - **OpenAPI plugin** to expose an OpenAPI spec for the auth endpoints.
 *
 * @param {DatabaseClient} database - The Drizzle ORM client instance, typically
 *   provided by the NestJS DI container via the `DRIZZLE_PROVIDER`.
 * @returns {ReturnType<typeof betterAuth>} A configured better-auth instance
 *   ready to handle authentication requests.
 *
 * @example
 * // Used inside an auth NestJS module factory:
 * const auth = BetterAuth(drizzleClient);
 * app.use('/auth', toNodeHandler(auth.handler));
 */
export const BetterAuth = (database: DatabaseClient) =>
  betterAuth({
    url: process.env.BETTER_AUTH_URL, // Used to build callback URLs & cookies
    secret: process.env.BETTER_AUTH_SECRET,
    basePath: '/auth',
    emailAndPassword: {
      enabled: true,
    },
    database: drizzleAdapter(database, {
      provider: 'pg',
      schema: { user, session, account, verification },
    }),
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 1 * 60, // Cache duration in seconds
      },
    },
    plugins: [openAPI()],
  });
