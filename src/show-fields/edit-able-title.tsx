import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Input, toast } from '@qunhe/muya-ui';

interface IEditableTitleProps {
    title: string;
    onChange?: (newTitle: string) => void;
}

const EditableTitle: React.FC<IEditableTitleProps> = (props: IEditableTitleProps) => {
    const { title, onChange } = props;
    const ref = useRef<HTMLDivElement | null>();
    const [editable, setEditable] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const handleEnter = useCallback(() => setEditable(true), []);
    const handleLeave = useCallback(() => setEditable(false), []);

    const handleInputChange = useCallback(e => {
        const { value } = e.target;
        setNewTitle(value);
    }, []);

    const handlePressEnter = useCallback(() => {
        if (!newTitle) {
            toast.warning('请填写内容');
            return;
        }

        setEditable(false);
        onChange && onChange(newTitle);
    }, [newTitle, onChange]);

    const handleClickAway = useCallback(event => {
        if (
            document.documentElement &&
            document.documentElement.contains(event.target) &&
            ref.current &&
            !(ref.current as any).contains(event.target) // 子节点不包含event.target
        ) {
            setEditable(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('click', handleClickAway);
        return () => {
            document.removeEventListener('click', handleClickAway);
        };
    });

    if (editable) {
        return (
            <Input
                ref={ref as any}
                width="100%"
                value={newTitle}
                onChange={handleInputChange}
                onPressEnter={handlePressEnter}
                onMouseLeave={handleLeave}
            />
        );
    } else {
        return (
            <strong
                style={{
                    cursor: 'pointer',
                }}
                onMouseEnter={handleEnter}
            >
                《{title}》
            </strong>
        );
    }
};

export default EditableTitle;
