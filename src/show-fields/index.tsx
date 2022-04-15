import { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import Sortable from "sortablejs";
import { OutlineTag, Space } from "@qunhe/muya-ui";
import { useStores } from "@/hooks/useStore";

const ShowFields: React.FC = observer(() => {
    const store = useStores();
    const fieldsLen = store.showFields.length;
    const tags = useRef<any[]>([]);

    useEffect(() => {
        if (tags.current) {
            tags.current = [...store.showFields];
        }
    }, [store.showFields])

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
    </Space>;
});

export default ShowFields;
