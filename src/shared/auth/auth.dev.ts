/**
 * @fileoverview Development-only better-auth configuration for CLI schema generation.
 *
 * @description
 * This file exports a minimal better-auth instance used exclusively by the
 * `@better-auth/cli` tool to introspect the auth configuration and generate
 * the corresponding database schemas. It should NOT be imported by the main
 * application; the production auth instance is created by the
 * {@link BetterAuth} factory in `better-auth.ts`.
 *
 * @module auth.dev
 */

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/node-postgres';

/**
 * Development-only better-auth instance used for schema generation.
 *
 * @description
 * Configured with email/password authentication and a plain Drizzle adapter
 * pointing at `DATABASE_URL`. The `@better-auth/cli` reads this export to
 * determine which tables and columns must exist in the database.
 *
 * @constant {ReturnType<typeof betterAuth>}
 */
// Used to generate the database schemas using @better-auth/cli
export const auth = betterAuth({
  url: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(drizzle(process.env.DATABASE_URL as string), {
    provider: 'pg',
  }),
});
