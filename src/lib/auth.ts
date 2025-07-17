import db from '@/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, customSession, username } from 'better-auth/plugins';
import { nextCookies } from 'better-auth/next-js';
import { useGetUserRoles } from '@/hooks/query/user';

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
      const { data: roles } = useGetUserRoles(session.userId);
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
