import { Theater } from '@/features';
import { get, login, verifyToken } from '@/services';
import { useRequest } from 'ahooks';
import { Alert, Button, Divider, Result, Spin, Typography } from 'antd';
import parseUrl from 'parse-url';
import { useEffect, useMemo } from 'react';
import { useModel } from 'umi';

const { Title } = Typography;

export default function User() {
  const token = localStorage.getItem('token');
  const { query } = useMemo(() => {
    const { query } = parseUrl(window.location.href);
    return {
      query,
    };
  }, []);
  const {
    data: userInfo,
    loading: loading1,
    error,
  } = useRequest(
    () => {
      if (query?.hash) {
        return login(query as LoginQuery);
      }
      return verifyToken(token);
    },
    {
      refreshDeps: [query],
      ready: !!query?.hash || !!token,
      loadingDelay: 300,
    },
  );
  const {
    data: userData,
    loading: loading2,
    refresh,
  } = useRequest(() => get<UserData>('userdata', userInfo?.id), {
    refreshDeps: [userInfo?.id],
    ready: !!userInfo?.id,
    loadingDelay: 300,
  });
  const { user, setUser } = useModel('user');

  useEffect(() => {
    if (userInfo) {
      setUser(userInfo);
    }
  }, [userInfo]);

  return (
    <section>
      <Title level={2}>用户信息</Title>
      {userInfo ? (
        <Spin spinning={loading1 || loading2}>
          {userData ? (
            <section>
              <Title level={3}>石头余额：{userData.balance}</Title>
              <Button type="primary" onClick={refresh}>
                刷新
              </Button>
            </section>
          ) : (
            <Alert type="info" showIcon message="请通过姬器人签到以激活账户" />
          )}
        </Spin>
      ) : null}

      {error ? (
        <Result
          status="error"
          title="您的登录凭据无法通过验证"
          subTitle="如果您认为该结果有误，请联系管理员。"
        />
      ) : null}

      <Divider />

      {userInfo?.id ? <Theater id={userInfo.id} /> : null}
    </section>
  );
}
