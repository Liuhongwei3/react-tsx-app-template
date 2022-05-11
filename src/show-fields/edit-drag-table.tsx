import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ITableColumn, Table } from '@qunhe/muya-ui';
import { BodyRow } from './body-row';
import { IFieldItem } from './type';
import { useStores } from '@/hooks/useStore';
import EditableTitle from './edit-able-title';

const EditDragTable: React.FC = observer(() => {
  const store = useStores();
  const data = store.showFields;

  const moveRow = useCallback((dragIndex: number, hoverIndex: number) => {
    console.log(dragIndex, hoverIndex);

    const prev = store.showFields;
    const prevAlbums = [...prev];
    const dragAlbum = prevAlbums[dragIndex];

    prevAlbums[dragIndex] = prevAlbums[hoverIndex];
    prevAlbums[hoverIndex] = dragAlbum;

    store.setShowFields(prevAlbums);
  }, [store]);

  const handleTitleChange = useCallback((id: string, newTitle: string) => {
    const prevData = store.showFields;
    prevData.map(item => {
      if (item.id === id) {
        return { ...item, title: newTitle };
      }

      return item;
    })

    store.setShowFields(prevData);
  }, []);

  const columns: ITableColumn<IFieldItem>[] = [
    {
      title: '字段 key',
      key: 'fieldKey',
      width: 200,
      dataIndex: 'fieldKey',
    },
    {
      title: '字段名称',
      key: 'title',
      width: 200,
      // render: item => <strong>{item.fieldName}</strong>,
      render: item => <EditableTitle
        title={item.fieldName}
        onChange={newTitle => handleTitleChange(item.fieldKey, newTitle)}
      />,
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      key: 'fieldType',
    },
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <Table<IFieldItem>
        rowKey="fieldKey"
        columns={columns}
        dataSource={data}
        components={{
          BodyRow,
        }}
        onRow={() => ({
          moveRow,
        })}
      />
    </DndProvider>
  );
});

export default EditDragTable;
