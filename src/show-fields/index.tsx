import { useCallback, useEffect, useRef, useState } from "react";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import Sortable from "sortablejs";
import { OutlineButton, OutlineTag, Row, Space, toast } from "@qunhe/muya-ui";
import { useStores } from "@/hooks/useStore";
import FieldService from "@/services/fields";
import EditTags from "./edit-tags";
import EditDragTags from "./edit-drag-tags-copy";
import EditDragTable from "./edit-drag-table";
// import EditDragTags from "./edit-drag-tags";

const ShowFields: React.FC = observer(() => {
    const store = useStores();
    const fieldsLen = store.showFields.length;
    const tags = useRef<any[]>([]);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if (tags.current) {
            tags.current = [...store.showFields];
        }
    }, [store.showFields]);

    const sortableTagDecorator = (componentBackingInstance: HTMLDivElement) => {
        if (componentBackingInstance) {
            // http://www.sortablejs.com/options.html
            const sortOptions: Sortable.Options = {
                draggable: '.tag-drag-item',
                handle: '.tag-drag-item',
                ghostClass: 'ghost-tag',
                animation: 150,
                onEnd: ({ oldIndex, newIndex }) => {
                    const currItem = tags.current.splice(oldIndex!, 1)[0];
                    if (currItem) {
                        tags.current.splice(newIndex!, 0, currItem);
                    }
                    store.setShowFields(tags.current);
                },
            };
            Sortable.create(componentBackingInstance, sortOptions);
        }
    };

    const handleSave = useCallback(() => {
        console.log(toJS(store), tags.current);
        if (store.showApiId && tags.current) {
            setSaveLoading(true);
            FieldService.postFieldListById(store.showApiId, tags.current)
                .then(() => {
                    toast.success('操作成功');
                })
                .catch(e => {
                    toast.error(e.message || '保存失败，请重试！');
                })
                .finally(() => {
                    setSaveLoading(false);
                })
        } else {
            toast.warning("请先选择接口后再操作！");
        }
    }, [store]);

    return <Space direction='vertical' style={{ width: '40vw' }}>
        <div>ShowFields - {fieldsLen}</div>
        <div
            style={{ border: fieldsLen ? '1px solid grey' : '' }}
            ref={sortableTagDecorator}
        >
            {!!fieldsLen && store.showFields.map(({ fieldKey, fieldType }, index) => <OutlineTag
                className="tag-drag-item"
                type="primary"
                size="l"
                style={{ margin: 10 }}
                key={fieldKey}
            >
                {index} - {fieldKey} - {fieldType}
            </OutlineTag>)}
        </div>

        <Row justify="end">
            <OutlineButton type="primary" loading={saveLoading} onClick={handleSave}>保存</OutlineButton>
        </Row>

        {/* <EditDragTags /> */}
        <EditDragTable />

        {/* {
            store.showFields.length ?
                <EditDragTags
                    initTags={toJS(store.showFields)}
                    setTags={updatedTags => {
                        console.log('update tags ---> ', updatedTags)
                        tags.current = updatedTags;
                        store.setShowFields(updatedTags);
                    }}
                /> :
                <div>当前暂无展示的字段</div>
        } */}
    </Space>;
});

export default ShowFields;
