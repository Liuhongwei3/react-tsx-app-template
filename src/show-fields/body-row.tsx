import { ITableBodyRowProps } from '@qunhe/muya-ui';
import { XYCoord } from 'dnd-core';
import { useRef } from 'react';
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd';
import { IFieldItem } from './type';

const ItemTypes = {
    ROW: 'row',
};
interface IDragItem {
    rowKey: any;
    rowIndex: number;
    type: string;
}

export function BodyRow(props: ITableBodyRowProps<IFieldItem>) {
    const ref = useRef<HTMLTableRowElement>(null);
    const { rowIndex: index, rowProps = {}, rowKey, children } = props;
    const [, drop] = useDrop({
        accept: ItemTypes.ROW,

        hover(item: IDragItem, monitor: DropTargetMonitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = item.rowIndex;
            const hoverIndex = index; // Don't replace items with themselves

            if (dragIndex === hoverIndex) {
                return;
            } // Determine rectangle on screen

            const hoverBoundingRect = ref.current!.getBoundingClientRect(); // Get vertical middle

            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2; // Determine mouse position

            const clientOffset = monitor.getClientOffset(); // Get pixels to the top

            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top; // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            } // Dragging upwards

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            } // Time to actually perform the action

            rowProps.moveRow && rowProps.moveRow(dragIndex, hoverIndex); // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.

            item.rowIndex = hoverIndex;
        },
    });
    const [{ isDragging }, drag] = useDrag({
        item: {
            type: ItemTypes.ROW,
            rowIndex: index,
            rowKey,
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));
    return (
        <tr
            ref={ref}
            key={rowKey}
            style={{
                opacity,
            }}
        >
            {children}
        </tr>
    );
}
