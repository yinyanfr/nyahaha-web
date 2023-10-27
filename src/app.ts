import { verifyToken } from '@/services';

export async function getInitialState() {
  let user: User | undefined = undefined;
  const token = localStorage.getItem('token');
  if (token) {
    user = await verifyToken(token);
  }
  return { user };
}
