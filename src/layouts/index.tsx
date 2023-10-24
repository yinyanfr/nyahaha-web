import { TGLoginButton } from '@/components';
import { Outlet, useModel } from 'umi';

export default function Layout() {
  const { user } = useModel('user');
  return (
    <div className="page-container">
      <nav className="main-nav">
        <div className="apart">
          <h2>喵哈哈</h2>
          {user ? null : <TGLoginButton />}
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>footer</footer>
    </div>
  );
}
