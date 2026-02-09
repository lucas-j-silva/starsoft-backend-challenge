import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { DrizzleClientService } from '../database/drizzle-client.service';
import {
  account,
  session,
  user,
  verification,
} from 'src/modules/auth/schemas/auth.schema';

export const BetterAuth = (drizzleClient: DrizzleClientService) =>
  betterAuth({
    url: process.env.BETTER_AUTH_URL, // Used to build callback URLs & cookies
    secret: process.env.BETTER_AUTH_SECRET,
    basePath: '/auth',
    emailAndPassword: {
      enabled: true,
    },
    database: drizzleAdapter(drizzleClient.getInstance(), {
      provider: 'pg',
      schema: { user, session, account, verification },
    }),
  });
