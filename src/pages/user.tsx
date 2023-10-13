import { get, login } from '@/services';
import { useRequest } from 'ahooks';
import { Alert, Spin } from 'antd';
import parseUrl from 'parse-url';
import { useEffect, useMemo } from 'react';
import { useModel } from 'umi';

export default function User() {
  const { query } = useMemo(
    () => parseUrl(window.location.href),
    [window.location.href],
  );
  const { data: userInfo, loading: loading1 } = useRequest(
    () => login(query as LoginQuery),
    {
      refreshDeps: [query],
      ready: !!query,
      loadingDelay: 300,
    },
  );
  const { data: userData, loading: loading2 } = useRequest(
    () => get<UserData>('userdata', userInfo?.id),
    {
      refreshDeps: [userInfo?.id],
      ready: !!userInfo?.id,
      loadingDelay: 300,
    },
  );
  const { user, setUser } = useModel('user');

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo]);

  return (
    <section>
      <p>User</p>
      <Spin spinning={loading1 || loading2}>
        {user ? <p>您已登录</p> : null}
        {userData ? (
          <p>石头余额：{userData.balance}</p>
        ) : (
          <Alert type="info" showIcon message="请通过姬器人签到以激活账户" />
        )}
      </Spin>
    </section>
  );
}
