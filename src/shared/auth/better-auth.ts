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
