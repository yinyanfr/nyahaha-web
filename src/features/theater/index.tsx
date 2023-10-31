import { registerDocListener } from '@/services';
import { FC, useEffect, useState } from 'react';
import CardsPreview from './cards-preview';
import { Divider, Typography } from 'antd';

const { Title } = Typography;

interface TheaterProps {
  id: string;
}

interface Gacha {
  ssr: number[];
  sr: number[];
  r: number;
  pieces: number;
}

const Theater: FC<TheaterProps> = ({ id }) => {
  const [gacha, setGacha] = useState<Gacha>();
  useEffect(() => {
    return registerDocListener('gacha', id, snapshot => {
      if (snapshot.exists()) {
        setGacha(snapshot.data() as Gacha);
      }
    });
  }, []);

  return (
    <section>
      <Title level={3}>SSR: {gacha?.ssr?.length ?? 0}</Title>
      {gacha?.ssr?.length ? <CardsPreview cardIds={gacha.ssr} /> : null}
      <Divider />
      <Title level={3}>SR: {gacha?.sr?.length ?? 0}</Title>
      {gacha?.sr?.length ? <CardsPreview cardIds={gacha.sr} /> : null}
      <Divider />
      <Title level={3}>R: {gacha?.r ?? 0}</Title>
      <p>R卡只记录数量</p>
    </section>
  );
};

export default Theater;
