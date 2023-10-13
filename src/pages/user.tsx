import { verifyTGLoginHash } from '@/lib';
import { get, login } from '@/services';
import { useRequest } from 'ahooks';
import { Alert, Result, Spin } from 'antd';
import parseUrl from 'parse-url';
import { useEffect, useMemo } from 'react';
import { useModel } from 'umi';

export default function User() {
  const { query, verified } = useMemo(() => {
    const { query } = parseUrl(window.location.href);
    const verificationHash = verifyTGLoginHash(query as LoginQuery);
    return {
      query,
      verified: verificationHash === query.hash,
    };
  }, []);
  const { data: userInfo, loading: loading1 } = useRequest(
    () => login(query as LoginQuery),
    {
      refreshDeps: [query],
      ready: !!query && verified,
      loadingDelay: 300,
    },
  );
  const { data: userData, loading: loading2 } = useRequest(
    () => get<UserData>('userdata', userInfo?.id),
    {
      refreshDeps: [userInfo?.id],
      ready: !!userInfo?.id && verified,
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
      {verified ? (
        <Spin spinning={loading1 || loading2}>
          {user ? <p>您已登录</p> : null}
          {userData ? (
            <p>石头余额：{userData.balance}</p>
          ) : (
            <Alert type="info" showIcon message="请通过姬器人签到以激活账户" />
          )}
        </Spin>
      ) : (
        <Result
          status="error"
          title="您的登录凭据无法通过验证"
          subTitle="如果您认为该结果有误，请联系管理员。"
        />
      )}
    </section>
  );
}
