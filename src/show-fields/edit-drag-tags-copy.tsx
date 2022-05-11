import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import Sortable from 'sortablejs';
import { useEventCallback } from '@qunhe/muya-core';
import { Input, Tag, Tooltip, useTheme } from '@qunhe/muya-ui';
import { CloseIcon, EditIcon, AlignmentIcon } from '@qunhe/muya-theme-light';
import { ITagItem } from './type';
import { useStores } from '@/hooks/useStore';

const EditDragTags: React.FC = observer(() => {
    const store = useStores();
    const theme = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);
    const [editIndex, setEditIndex] = useState(-1);
    const [inputValue, setInputValue] = useState('');

    const sortableTagDecorator = (componentBackingInstance: HTMLDivElement) => {
        if (componentBackingInstance) {
            // http://www.sortablejs.com/options.html
            const sortOptions: Sortable.Options = {
                draggable: '.tag-drag-item',
                handle: '.tag-drag-icon',
                ghostClass: 'ghost-tag',
                animation: 150,
                onEnd: ({ oldIndex, newIndex }) => {
                    const currItem = store.showFields.splice(oldIndex!, 1)[0];
                    if (currItem) {
                        store.showFields.splice(newIndex!, 0, currItem);
                    }
                    store.setShowFields(store.showFields);
                },
            };
            Sortable.create(componentBackingInstance, sortOptions);
        }
    };

    const handleClose = useEventCallback((tag: ITagItem) => {
        const fields = store.showFields.filter(ctag => ctag.fieldKey !== tag.fieldKey);
        store.setShowFields(fields);
    }, []);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        [],
    );

    const handleInputConfirm = useEventCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            const tagIndex = store.showFields.findIndex(item => item.fieldName === inputValue);
            if (inputValue && editIndex > -1 && (tagIndex === -1 || tagIndex === editIndex)) {
                const fields = store.showFields.map(
                    (tag, index) => index === editIndex ?
                        { ...tag, fieldName: inputValue } : tag
                );
                store.setShowFields(fields);
                setInputValue('');
                setEditIndex(-1);
                return;
            }
            // if (inputValue && tagIndex === -1) {
            //     const fields = [...store.showFields, {
            //         fieldName: inputValue
            //     }];
            //     setTags(fields);
            // }
            setInputValue('');
        },
        [inputValue],
    );

    const handleBlur = useEventCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            const tagIndex = store.showFields.findIndex(item => item.fieldName === inputValue);
            console.log(inputValue, editIndex > -1, tagIndex === -1, tagIndex === editIndex);
            if (inputValue && editIndex > -1 && (tagIndex === -1 || tagIndex === editIndex)) {
                const fields = store.showFields.map(
                    (tag, index) => index === editIndex ?
                        { ...tag, fieldName: inputValue } : tag
                );
                store.setShowFields(fields);
                setInputValue('');
                setEditIndex(-1);
                return;
            }

            // if (inputValue && tagIndex === -1) {
            //     const fields = [...store.showFields, {
            //         fieldName: inputValue
            //     }];
            //     setTags(fields);
            //     setInputValue('');
            // }
        },
        [inputValue],
    );

    const handleClick = useCallback((tag: ITagItem) => {
        setEditIndex(store.showFields.findIndex(ctag => ctag.fieldKey === tag.fieldKey));
        setInputValue(tag.fieldName);
    }, []);

    console.log('comp -----> ', store.showFields);
    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap'
            }}
            key={store.showFields.length}
            ref={sortableTagDecorator}
        >
            {store.showFields.map((tag, index) => {
                return index === editIndex ? (
                    <Input
                        placeholder="按回车生效"
                        key={`input${tag?.fieldKey}${index}`}
                        ref={inputRef}
                        type="text"
                        style={{
                            borderRadius: theme.size.spec.borderRadius.s5,
                            width: 150,
                            marginBottom: 8
                        }}
                        size="s"
                        autoFocus={true}
                        allowClear={true}
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        onPressEnter={handleInputConfirm}
                    />
                ) : <div className="tag-drag-item" key={`tag-drag-item${tag?.fieldKey}${index}`}>
                    <Tooltip
                        key={`tooltip${tag?.fieldKey}${index}`}
                        title={tag.fieldName}
                        triggerAction="hover"
                        placement="top"
                    >
                        <StyledTag
                            size="l"
                            key={`tag${tag?.fieldKey}${index}`}
                            hoverable={false}
                            title={tag.fieldName}
                        >
                            {tag.fieldName}
                            <MaskWrapper className="tag-mask">
                                <IconWrapper>
                                    <AlignmentIcon className="tag-drag-icon" />
                                    <div />
                                    <EditIcon onClick={() => handleClick(tag)} />
                                    <div />
                                    <CloseIcon onClick={() => handleClose(tag)} />
                                </IconWrapper>
                            </MaskWrapper>
                        </StyledTag>
                    </Tooltip>
                </div>;
            })}
        </div>
    );
});

export default EditDragTags;

const StyledTag = styled(Tag)`
  	width: 150px;
  	margin: 0 8px 8px 0;
  	text-align: center;
  	position: relative;
  	overflow: hidden;

    &:hover .tag-mask {
        display: flex;
    }
`;

const MaskWrapper = styled.div`
    display: none;
  	position: absolute;
  	left: 0;
  	top: 0;
  	right: 0;
  	bottom: 0;
  	background-color: rgba(0, 0, 0, 0.7);
  	justify-content: center;
  	align-items: center;
`;

const IconWrapper = styled.div`
  	color: #ccc;
  	display: flex;
  	align-items: center;

  	> div {
  	  	width: 2px;
  	  	height: 10px;
  	  	margin: 0 8px;
  	  	background-color: #ccc;
  	}

  	svg {
  	  	cursor: pointer;
  	}
`;
