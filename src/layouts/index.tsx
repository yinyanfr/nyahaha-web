import { TGLoginButton } from '@/components';
import { Space, Spin, Typography } from 'antd';
import { Link, Outlet, useModel } from 'umi';

export default function Layout() {
  const { initialState, loading } = useModel('@@initialState');
  return (
    <div className="page-container">
      <nav className="main-nav">
        <div className="apart">
          <Space>
            <Link to="/" style={{ color: 'black' }}>
              喵哈哈
            </Link>
            <Link to="/theater">事务所</Link>
            <Link to="/book">账本</Link>
          </Space>
          <Spin spinning={loading}>
            {initialState?.user ? (
              <Link to="/user">{initialState.user.first_name}</Link>
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
