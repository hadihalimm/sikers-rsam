import { auth } from './auth';

export async function getCurrentSession(headers: Headers) {
  return await auth.api.getSession({
    headers: headers,
  });
}
