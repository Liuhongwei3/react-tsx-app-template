import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Alert, OutlineButton, Select, Space, toast } from '@qunhe/muya-ui';
import { AddIcon } from '@qunhe/muya-theme-light';
import { useStores } from '@/hooks/useStore';
import YapiService from './api';
import { IApiDetail, IGroup, IYapiCategory, IYapiInterfaceDescription } from './types';

const getPropertiesObj = (obj: any): any => {
    if (obj?.data) {
        return getPropertiesObj(obj.data);
    }
    if (obj.type === 'object' && obj.properties) {
        return getPropertiesObj(obj.properties)
    }
    if (obj.type === 'array') {
        if (obj?.items) {
            return getPropertiesObj(obj.items.properties);
        }
        if (obj?.list) {
            return getPropertiesObj(obj.list.properties);
        }
    }

    return obj;
};

const getObj = (data: any) => {
    let obj = typeof data === 'string' ? JSON.parse(data) : data;

    if (obj?.d && typeof obj?.d === 'object') {
        obj = getPropertiesObj(obj.d);
    }

    if (obj?.data) {
        obj = obj.data;
    }

    if (Array.isArray(obj)) {
        obj = obj[0];
    } else if (Array.isArray(obj?.list)) {
        obj = obj.list[0];
    } else if (Array.isArray(obj?.items)) {
        obj = obj.items[0];
    }

    return obj;
};

const YapiFields: React.FC = observer(() => {
    const store = useStores();
    const showFieldKeys = store.showFields.map(field => field.fieldKey);
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [groupId, setGroupId] = useState<number>();
    const [projects, setProjects] = useState<IGroup[]>([]);
    const [projectId, setProjectId] = useState<number>();
    const [categoryId, setCategoryId] = useState<number>();
    const [categorys, setCategorys] = useState<IYapiCategory[]>([]);
    const [apiId, setApiId] = useState<number>();
    const [apiList, setApiList] = useState<IYapiInterfaceDescription[]>([]);
    // const [curApi, setCurApi] = useState<IYapiInterfaceDescription>();
    const [curApi, setCurApi] = useState<IApiDetail>();
    // const [resBody, setResBody] = useState<any>();
    const [fields, setFields] = useState<any[]>([]);

    useEffect(() => {
        YapiService.getYapiGroupList().then(res => {
            setGroups(res.data);
        })
    }, []);

    useEffect(() => {
        if (groupId) {
            YapiService.getYapiProjectList(groupId).then(res => {
                setProjects(res.data);
            })
        }
    }, [groupId]);

    useEffect(() => {
        if (groupId && projectId) {
            YapiService.getYapiApiList(groupId, projectId).then(({ categorys, interfaces }) => {
                setCategorys(categorys);
                setApiList(e => [...e, ...interfaces]);
            })
        }
    }, [groupId, projectId]);

    useEffect(() => {
        if (groupId && projectId && categoryId) {
            YapiService.getYapiApiList(groupId, projectId, categoryId).then(({ categorys, interfaces }) => {
                setCategorys(e => [...e, ...categorys]);
                setApiList(interfaces);
            })
        }
    }, [groupId, projectId, categoryId]);

    const updateCurApi = useCallback(
        (v: number) => {
            // const apiItem = apiList.find(api => api.id === v);
            // const resBody = apiItem?.res_body;

            setApiId(v);
            // setCurApi(apiItem);
            // // setResBody();

            // if (resBody) {
            //     const objs = resBody.properties.d.properties.list.items.properties;
            //     const initFields = Object.entries(objs).map(([k,v]) => ({
            //         key: k,
            //         type: v.type
            //     }));
            //     console.log(objs, initFields);
            //     setFields(initFields);
            // }

            YapiService.getYapiApiById(v).then(({ data }) => {
                let obj = typeof data.res_body === 'object' ? data.res_body : JSON.parse(data.res_body);
                console.log(data, obj);
                if (!data.res_body || typeof obj !== 'object') {
                    setFields([]);
                    toast.warning("无法正确获取响应体中的字段，请检查返回内容！");
                    return;
                }

                if (data.res_body_is_json_schema) {
                    if (obj?.properties) {
                        obj = getPropertiesObj(obj.properties);
                    }
                    if (obj.type === 'object') {
                        obj = getObj(getPropertiesObj(obj));
                    } else if (obj.type === 'array') {
                        if (obj?.items) {
                            obj = obj.items.properties;
                        }
                        if (obj?.list) {
                            obj = obj.list.properties;
                        }
                    }
                    obj = getObj(obj);

                    const initFields = Object.entries(obj).map(([k, v]) => ({
                        key: k,
                        type: typeof v
                    }));
                    console.log(data, obj);
                    setCurApi(data);
                    setFields(initFields);
                } else {
                    const objs = getObj(obj);

                    const initFields = Object.entries(objs).map(([k, v]) => ({
                        key: k,
                        type: typeof v
                    }));
                    console.log(data, obj);
                    setCurApi(data);
                    setFields(initFields);
                }
            })
        },
        [apiList],
    );

    const updateShowFields = useCallback((field: any) => {
        let keys = [...store.showFields];

        if (showFieldKeys.includes(field.key)) {
            keys = keys.filter(key => key.fieldKey !== field.key);
        } else {
            keys = [...store.showFields, {
                fieldKey: field.key,
                fieldType: field.type
            }];
        }
        store.setShowFields(keys);
    }, [store, showFieldKeys]);

    return <Space direction='vertical' style={{ width: '40vw' }}>
        <Select
            showSearch={true}
            value={groupId}
            onChange={v => setGroupId(v as number)}
        >
            {
                groups.map(({ id, name }) => <Select.Option key={id} value={id}>
                    {name}
                </Select.Option>)
            }
        </Select>
        <Select
            showSearch={true}
            value={projectId}
            onChange={v => setProjectId(v as number)}
        >
            {
                projects.map(({ id, name }) => <Select.Option key={id} value={id}>
                    {name}
                </Select.Option>)
            }
        </Select>
        <Select
            showSearch={true}
            value={categoryId}
            onChange={v => setCategoryId(v as number)}
        >
            {
                categorys.map(({ id, name }) => <Select.Option key={id} value={id}>
                    {name}
                </Select.Option>)
            }
        </Select>
        <Select
            showSearch={true}
            value={apiId}
            onChange={v => updateCurApi(v as number)}
        >
            {
                apiList.map(({ id, title }) => <Select.Option key={id} value={id}>
                    {title}
                </Select.Option>)
            }
        </Select>

        {
            curApi ? <div style={{ maxHeight: 300, overflowY: 'scroll' }}>
                <p>title: {curApi.title}</p>
                <p>path: {curApi.path}</p>
                <div dangerouslySetInnerHTML={{ __html: curApi.desc }}></div>
                <p>username: {curApi.username}</p>
                <p>Method: {curApi.method}</p>
                <p>res_body_is_json_schema: {String(curApi.res_body_is_json_schema)}</p>
            </div> : <Alert style={{ marginTop: 16 }} type='warning'>暂无响应体内容</Alert>
        }

        <div style={{ maxHeight: 400, overflowY: 'scroll' }}>
            {
                fields.map(({ key, type }) => <OutlineButton
                    style={{ margin: 10, display: 'block' }}
                    type={showFieldKeys.includes(key) ? 'success' : 'primary'}
                    key={key}
                    suffixNode={
                        <span> | {showFieldKeys.includes(key) ? '^' : <AddIcon />}</span>
                    }
                    onClick={() => updateShowFields({ key, type })}
                >
                    {key} - {type}
                </OutlineButton>)
            }
        </div>
    </Space>;
});

export default YapiFields;
