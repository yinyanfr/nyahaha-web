import { TGLoginButton } from '@/components';
import { BookKeeping } from '@/features';
import { get } from '@/services';
import { useRequest } from 'ahooks';
import { Result, Spin, Typography } from 'antd';
import { useModel } from 'umi';

const { Title } = Typography;

export default function BookPage() {
  const { initialState } = useModel('@@initialState');
  const user = initialState?.user;

  const { data: userData, loading } = useRequest(
    () => get<UserData>('userdata', user?.id),
    {
      refreshDeps: [user?.id],
      ready: !!user?.id,
      loadingDelay: 300,
    },
  );

  return (
    <section className="better-smaller">
      <Title level={2}>账本</Title>
      {user?.id ? (
        <Spin spinning={loading}>
          {userData ? <BookKeeping id={user.id} userdata={userData} /> : null}
        </Spin>
      ) : (
        <Result title="您尚未登录" extra={<TGLoginButton />} />
      )}
    </section>
  );
}
