import { verifyToken } from '@/services';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';

dayjs.extend(localizedFormat);
dayjs.extend(utc);

export async function getInitialState() {
  let user: User | undefined = undefined;
  const token = localStorage.getItem('token');
  if (token) {
    user = await verifyToken(token);
  }
  return { user };
}
