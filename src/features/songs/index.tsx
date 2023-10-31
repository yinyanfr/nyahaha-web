import { auth, registerCollectionListener } from '@/services';
import { Button, Input, Drawer, Space, Tag } from 'antd';
import { useEffect, useId, useState } from 'react';
import SongEditor from './song-editor';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function SongList() {
  const id = useId();
  const [currentUser] = useAuthState(auth);

  const [songs, setSongs] = useState<Song[]>([]);
  const [filter, setFilter] = useState<string>();
  const [editorOpen, setEditorOpen] = useState<Song>();

  useEffect(() => {
    return registerCollectionListener('songs', snapshot => {
      const songs: Song[] = [];
      snapshot.forEach(e => {
        songs.push({ ...(e.data() as Song), id: e.id });
      });
      setSongs(songs);
    });
  }, []);

  const columns: ProColumns<Song>[] = [
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'name',
    },
    {
      title: 'Youtube ID',
      dataIndex: 'youtubeId',
      key: 'youtubeId',
      responsive: ['md'],
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render(_, record) {
        return (
          <Space>
            {record.tags.map(e => (
              <Tag key={`${id}-${record.id}-${e}`}>{e}</Tag>
            ))}
          </Space>
        );
      },
      responsive: ['lg'],
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render(_, entity) {
        return entity.updatedAt
          ? dayjs(entity.updatedAt.toDate()).format('lll')
          : '';
      },
      sortOrder: 'descend',
      sorter(a, b) {
        return dayjs(a.updatedAt?.toDate() ?? '2023-01-01').diff(
          dayjs(b.updatedAt?.toDate() ?? '2023-01-01'),
        );
      },
      // responsive: ['lg'],
    },
    {
      title: 'Options',
      render(_, record) {
        return (
          <Space>
            {currentUser ? (
              <Button
                type="link"
                onClick={() => {
                  setEditorOpen(record);
                }}>
                编辑
              </Button>
            ) : null}
          </Space>
        );
      },
    },
  ];

  return (
    <section>
      <ProTable<Song>
        headerTitle={`歌曲总数：${songs.length}`}
        rowKey="id"
        search={false}
        options={false}
        pagination={{ pageSize: 50 }}
        columns={columns}
        dataSource={songs?.filter(
          e =>
            e.title.match(new RegExp(filter ?? '', 'gi')) ||
            e.tags.find(e => e.match(new RegExp(filter ?? '', 'gi'))),
        )}
        toolbar={{
          search: (
            <Input.Search
              placeholder="Name"
              allowClear
              onSearch={value => {
                setFilter(value);
              }}
            />
          ),
          actions: [
            currentUser ? (
              <Button
                key={`${id}-song-table-create`}
                type="primary"
                onClick={() => {
                  setEditorOpen({} as Song);
                }}>
                新增
              </Button>
            ) : null,
          ],
        }}
      />
      <Drawer
        open={!!editorOpen}
        footer={null}
        size="large"
        onClose={() => {
          setEditorOpen(undefined);
        }}>
        {editorOpen ? (
          <SongEditor
            song={editorOpen}
            songs={songs}
            onSubmitted={() => {
              setEditorOpen(undefined);
            }}
          />
        ) : null}
      </Drawer>
    </section>
  );
}
