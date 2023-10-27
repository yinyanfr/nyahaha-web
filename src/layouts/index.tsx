import { TGLoginButton } from '@/components';
import { Spin } from 'antd';
import { Outlet, useModel } from 'umi';

export default function Layout() {
  const { initialState, loading } = useModel('@@initialState');
  return (
    <div className="page-container">
      <nav className="main-nav">
        <div className="apart">
          <h2>喵哈哈</h2>
          <Spin spinning={loading}>
            {initialState?.user ? (
              initialState.user.first_name
            ) : (
              <TGLoginButton />
            )}
          </Spin>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      <footer>footer</footer>
    </div>
  );
}
