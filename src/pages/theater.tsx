import { useModel } from 'umi';
import { Result, Typography } from 'antd';
import { Theater } from '@/features';
import { TGLoginButton } from '@/components';

const { Title } = Typography;

export default function TheaterPage() {
  const { initialState } = useModel('@@initialState');
  const user = initialState?.user;

  return (
    <section>
      <Title level={2}>事务所</Title>

      {user?.id ? (
        <Theater id={user.id} />
      ) : (
        <Result title="您尚未登录" extra={<TGLoginButton />} />
      )}
    </section>
  );
}
