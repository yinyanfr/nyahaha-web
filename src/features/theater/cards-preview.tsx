import { getFileUrls } from '@/services';
import { useRequest } from 'ahooks';
import { Image, Spin } from 'antd';
import { useId, type FC } from 'react';

interface CardsPreviewProps {
  cardIds: number[];
}

const CardsPreview: FC<CardsPreviewProps> = ({ cardIds }) => {
  const id = useId();
  const { loading: loading1, data: cardIconUrls } = useRequest(
    () => getFileUrls(cardIds.map(e => `cgss-cards/${e}/icon.png`)),
    { refreshDeps: [cardIds], ready: !!cardIds?.length },
  );
  const { loading: loading2, data: cardUrls } = useRequest(
    () => getFileUrls(cardIds.map(e => `cgss-cards/${e}/card.png`)),
    { refreshDeps: [cardIds], ready: !!cardIds?.length },
  );

  return (
    <Spin spinning={loading1 || loading2}>
      <Image.PreviewGroup items={cardUrls}>
        {cardIconUrls?.map(e => <Image key={`${id}-${e}`} src={e} />)}
      </Image.PreviewGroup>
    </Spin>
  );
};

export default CardsPreview;
