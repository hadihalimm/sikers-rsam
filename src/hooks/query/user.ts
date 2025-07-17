import db from '@/db';
import { user } from '@/db/schema';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';

export const useGetUserRoles = (userId: string) => {
  return useQuery<string | undefined | null>({
    queryKey: ['userRoles', userId],
    queryFn: async () => {
      const record = await db.query.user.findFirst({
        columns: {
          role: true,
        },
        where: eq(user.id, userId),
      });
      return record ? record.role : undefined;
    },
  });
};
