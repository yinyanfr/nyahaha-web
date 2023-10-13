import { TGLoginButton } from '@/components';
import { Outlet } from 'umi';

export default function Layout() {
  return (
    <div className="page-container">
      <nav className="main-nav">
        <div className="apart">
          <h2>喵哈哈</h2>
          <TGLoginButton />
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>footer</footer>
    </div>
  );
}
