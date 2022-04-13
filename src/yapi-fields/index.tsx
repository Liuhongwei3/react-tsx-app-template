import { Select, Tooltip } from '@qunhe/muya-ui';
import React from 'react';
import YapiService from './api';
import { IGroup, IYapiCategory, IYapiInterfaceDescription } from './types';

const YapiFields: React.FC = () => {
    const [groups, setGroups] = React.useState<IGroup[]>([]);
    const [groupId, setGroupId] = React.useState<number>();
    const [projects, setProjects] = React.useState<IGroup[]>([]);
    const [projectId, setProjectId] = React.useState<number>();
    const [categoryId, setCategoryId] = React.useState<number>();
    const [categorys, setCategorys] = React.useState<IYapiCategory[]>([]);
    const [apiList, setApiList] = React.useState<IYapiInterfaceDescription[]>([]);

    React.useEffect(() => {
        YapiService.getYapiGroupList().then(res => {
            setGroups(res.data);
        })
    }, []);

    React.useEffect(() => {
        if (groupId) {
            YapiService.getYapiProjectList(groupId).then(res => {
                setProjects(res.data);
            })
        }
    }, [groupId]);

    React.useEffect(() => {
        if (groupId && projectId) {
            YapiService.getYapiApiList(groupId, projectId).then(({ categorys, interfaces }) => {
                setCategorys(categorys);
                // setApiList(interfaces);
            })
        }
    }, [groupId, projectId]);

    React.useEffect(() => {
        if (groupId && projectId && categoryId) {
            YapiService.getYapiApiList(groupId, projectId, categoryId).then(({ categorys, interfaces }) => {
                // setCategorys(categorys);
                setApiList(interfaces);
            })
        }
    }, [groupId, projectId, categoryId]);

    return <div>
        <Select value={groupId} onChange={v => setGroupId(v as number)}>
            {
                groups.map(({ id, name }) => <Select.Option key={id} value={id}>
                    {name}
                </Select.Option>)
            }
        </Select>
        <Select value={projectId} onChange={v => setProjectId(v as number)}>
            {
                projects.map(({ id, name }) => <Select.Option key={id} value={id}>
                    {name}
                </Select.Option>)
            }
        </Select>
        <Select value={categoryId} onChange={v => setCategoryId(v as number)}>
            {
                categorys.map(({ id, name }) => <Select.Option key={id} value={id}>
                    {name}
                </Select.Option>)
            }
        </Select>
        <Select
        // value={categoryId} 
        // onChange={v => setCategoryId(v as number)}
        >
            {
                apiList.map(({ id, title }) => <Select.Option key={id} value={id}>
                    {title}
                </Select.Option>)
            }
        </Select>
    </div>;
};

export default YapiFields;
