import AdminLoginButton from '@/components/admin-login-button';
import { auth } from '@/services';
import { Divider } from 'antd';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SongList } from '@/features';

export default function Songs() {
  const [currentUser] = useAuthState(auth);

  return (
    <section>
      <p>Songs</p>
      {currentUser ? '已登录' : <AdminLoginButton />}
      <Divider />
      <SongList />
    </section>
  );
}
