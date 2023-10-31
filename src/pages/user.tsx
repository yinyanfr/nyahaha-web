import { TGLoginButton } from '@/components';
import { get } from '@/services';
import { useRequest } from 'ahooks';
import { Button, Result, Spin, Typography } from 'antd';
import { useModel } from 'umi';

const { Title } = Typography;

export default function User() {
  const { initialState } = useModel('@@initialState');
  const user = initialState?.user;

  const {
    data: userData,
    loading,
    error,
    refresh,
  } = useRequest(() => get<UserData>('userdata', user?.id), {
    refreshDeps: [user?.id],
    ready: !!user?.id,
    loadingDelay: 300,
  });

  return (
    <section>
      <Title level={2}>用户信息</Title>
      {user ? (
        <Spin spinning={loading}>
          {userData ? (
            <section>
              <Title level={3}>昵称：{userData.nickname ?? '大哥哥'}</Title>
              <Title level={3}>
                时区：UTC{(userData?.timezone ?? 0) < 0 ? '-' : '+'}
                {userData.timezone ?? 8}
              </Title>
              <Title level={3}>石头余额：{userData.balance}</Title>
              <Button type="primary" onClick={refresh}>
                刷新
              </Button>
            </section>
          ) : null}
          {error ? <Result title="请通过姬器人签到以激活账户" /> : null}
        </Spin>
      ) : (
        <Result title="您尚未登录" extra={<TGLoginButton />} />
      )}
    </section>
  );
}
