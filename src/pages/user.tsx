import { TGLoginButton } from '@/components';
import { Theater } from '@/features';
import { get } from '@/services';
import { useRequest } from 'ahooks';
import { Button, Divider, Result, Spin, Typography } from 'antd';
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

      <Divider />

      {user?.id ? <Theater id={user.id} /> : null}
    </section>
  );
}
