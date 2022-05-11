import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Sortable from 'sortablejs';
import { useEventCallback } from '@qunhe/muya-core';
import { Input, Tag, Tooltip, useTheme } from '@qunhe/muya-ui';
import { CloseIcon, EditIcon, AlignmentIcon } from '@qunhe/muya-theme-light';
import { ITagItem } from './type';

interface IProps {
    initTags: ITagItem[];
    setTags: (v: ITagItem[]) => void;
}

const EditDragTags: React.FC<IProps> = (props: IProps) => {
    const { initTags, setTags } = props;
    const theme = useTheme();
    const inputRef = useRef<HTMLInputElement>(null);
    const tags = React.useRef([...initTags]);
    const [editIndex, setEditIndex] = useState(-1);
    const [inputVisible, setInputVisible] = useState(false);
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
                    const currItem = tags.current.splice(oldIndex!, 1)[0];
                    if (currItem) {
                        tags.current.splice(newIndex!, 0, currItem);
                    }
                    setTags(tags.current);
                },
            };
            Sortable.create(componentBackingInstance, sortOptions);
        }
    };

    const handleClose = useEventCallback((tag: ITagItem) => {
        tags.current = tags.current.filter(ctag => ctag.fieldKey !== tag.fieldKey);
        console.log(tags.current);
        setTags(tags.current);
    }, [tags]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
        },
        [],
    );

    const handleInputConfirm = useEventCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            const tagIndex = tags.current.findIndex(item => item.fieldName === inputValue);
            if (inputValue && editIndex > -1 && (tagIndex === -1 || tagIndex === editIndex)) {
                tags.current = tags.current.map(
                    (tag, index) => index === editIndex ?
                        { ...tag, fieldName: inputValue } : tag
                );
                setTags(tags.current);
                setInputValue('');
                setEditIndex(-1);
                return;
            }
            // if (inputValue && tagIndex === -1) {
            //     tags.current = [...tags.current, {
            //         fieldName: inputValue
            //     }];
            //     setTags(tags.current);
            // }
            setInputVisible(false);
            setInputValue('');
        },
        [inputValue, tags],
    );

    const handleBlur = useEventCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            const tagIndex = tags.current.findIndex(item => item.fieldName === inputValue);
            console.log(inputValue, editIndex > -1, tagIndex === -1, tagIndex === editIndex);
            if (inputValue && editIndex > -1 && (tagIndex === -1 || tagIndex === editIndex)) {
                tags.current = tags.current.map(
                    (tag, index) => index === editIndex ?
                        { ...tag, fieldName: inputValue } : tag
                );
                setTags(tags.current);
                setInputValue('');
                setEditIndex(-1);
                return;
            }

            if (!e.currentTarget.value) {
                setInputVisible(false);
                return;
            }
            // if (inputValue && tagIndex === -1) {
            //     tags.current = [...tags.current, {
            //         fieldName: inputValue
            //     }];
            //     setTags(tags.current);
            //     setInputVisible(false);
            //     setInputValue('');
            // }
        },
        [inputValue, tags],
    );

    const handleClick = useCallback((tag: ITagItem) => {
        setEditIndex(tags.current.findIndex(ctag => ctag.fieldKey === tag.fieldKey));
        setInputValue(tag.fieldName);
    }, [tags]);

    console.log('comp -----> ', tags.current);
    return (
        <div key={tags.current.length}>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap'
                }}
                ref={sortableTagDecorator}
            >
                {tags.current.map((tag, index) => {
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
            {inputVisible && (
                <Input
                    placeholder="按回车生效"
                    maxLength={50}
                    ref={inputRef}
                    type="text"
                    style={{
                        borderRadius: theme.size.spec.borderRadius.s5,
                        width: 100,
                    }}
                    size="s"
                    autoFocus={true}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    onPressEnter={handleInputConfirm}
                />
            )}
        </div>
    );
};

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
