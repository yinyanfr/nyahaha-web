import { calculateTagConcurrences, cleanYoutubeLink } from '@/lib';
import { create, update } from '@/services';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useMemo, type FC } from 'react';

interface SongEditorProps {
  song: Partial<Song>;
  songs: Song[];
  onSubmitted: () => void;
}

const SongEditor: FC<SongEditorProps> = ({ song, songs, onSubmitted }) => {
  const concurrences = useMemo(() => calculateTagConcurrences(songs), [songs]);

  return (
    <ProForm
      initialValues={song}
      onFinish={async values => {
        const youtubeId = cleanYoutubeLink(values.youtubeId);
        if (song.id) {
          await update('songs', song.id, { ...values, youtubeId });
        } else {
          if (songs.find(e => e.youtubeId === youtubeId)) {
            message.warning('This songs has already been added.');
          } else {
            await create('songs', { ...values, youtubeId });
          }
        }
        onSubmitted();
      }}>
      <ProFormText
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please enter the title!' }]}
      />
      <ProFormText
        label="Youtube ID"
        name="youtubeId"
        rules={[{ required: true, message: 'Please enter the Youtube ID!' }]}
      />

      <ProFormSelect
        mode="tags"
        label="Tags"
        name="tags"
        options={concurrences.map(e => ({ value: e, label: e }))}
      />
    </ProForm>
  );
};

export default SongEditor;
