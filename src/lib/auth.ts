import db from '@/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, customSession, username } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { eq } from 'drizzle-orm';
import { user as userTable } from '@/db/schema/user';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  plugins: [
    username(),
    admin(),
    customSession(async ({ user, session }) => {
      const roles = await db.query.user.findFirst({
        columns: {
          role: true,
        },
        where: eq(userTable.id, user.id),
      });
      return {
        user: {
          ...user,
          roles: roles,
        },
        session,
      };
    }),
    nextCookies(),
  ],
});
