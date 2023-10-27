import { TGLoginButton } from '@/components';
import { login } from '@/services';
import { useRequest } from 'ahooks';
import { Result, Spin } from 'antd';
import parseUrl from 'parse-url';
import { useEffect, useMemo } from 'react';
import { useModel, useNavigate } from 'umi';

// receives login result
export default function Login() {
  const navigate = useNavigate();
  const { setInitialState } = useModel('@@initialState');
  const { query } = useMemo(() => parseUrl(window.location.href), []);

  const {
    data: user,
    loading,
    error,
  } = useRequest(() => login(query as LoginQuery), {
    refreshDeps: [query],
    ready: !!query?.hash,
    loadingDelay: 300,
  });

  useEffect(() => {
    if (user) {
      setInitialState(prev => ({ ...prev, user }));
      setTimeout(() => {
        navigate('/user');
      }, 1000);
    }
  }, [user]);
  return (
    <section>
      <Spin spinning={loading}>
        {loading ? <Result title="正在登录" /> : null}
        {user ? (
          <Result
            status="success"
            title="登录成功"
            subTitle="正在跳转至用户页面"
          />
        ) : null}
        {error ? (
          <Result
            status="error"
            title="您的登录凭据无法通过验证"
            subTitle="请重新登录，如果您认为该结果有误，请联系管理员。"
            extra={<TGLoginButton />}
          />
        ) : null}
      </Spin>
    </section>
  );
}
