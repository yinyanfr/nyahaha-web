import { getAndCache } from '@/services';
import { useRequest } from 'ahooks';
import { Card, Spin } from 'antd';
import { FC } from 'react';

interface CardCardProps {
  cardId: number;
  imageUrl?: string;
}

const rarities = {
  7: 'SSR',
  5: 'SR',
  3: 'R',
};

const CardCard: FC<CardCardProps> = ({ cardId, imageUrl }) => {
  const { loading, data } = useRequest(
    () => getAndCache<CGSSCard>('cgss-cards', `${cardId}`),
    {
      refreshDeps: [cardId],
      ready: cardId !== undefined,
    },
  );

  const cardWidth = Math.min(600, 0.8 * window.innerWidth);
  const cardHeight = (cardWidth * 814) / 598;

  return (
    <Card
      hoverable
      style={{ width: cardWidth, minHeight: cardHeight }}
      cover={<img alt={`${cardId}`} src={imageUrl} width={cardWidth} />}>
      <Spin spinning={loading}>
        <Card.Meta
          title={`${
            rarities[data?.rarity?.rarity as keyof typeof rarities]
          } [${data?.title}] ${data?.name_only}`}
        />
      </Spin>
    </Card>
  );
};

export default CardCard;
