import request from '@/common/api';
import { handleError } from '@/common/utils';
import {
    IGetYapiGroupListResponse,
    IYapiCategory,
    IYapiInterfaceDescription
} from './types';

const GET_YAPI_GROUP_URI = '/api/openapi/group';

class YapiServiceClass {
    /* 获取yapi组织列表 */
    getYapiGroupList = () => {
        return request.get<IGetYapiGroupListResponse>(GET_YAPI_GROUP_URI).catch(handleError);
    };

    /* 获取yapi指定组的项目列表 */
    getYapiProjectList = (groupId: number) => {
        return request
            .get<IGetYapiGroupListResponse>(`${GET_YAPI_GROUP_URI}/${groupId}/project`)
            .catch(handleError);
    };

    /* 获取yapi制定项目的接口列表 */
    getYapiApiList = (groupId: number, projectId: number, categoryId?: number) => {
        const params: { category?: number } = {};
        if (categoryId) {
            params.category = categoryId;
        }

        return request
            .get<{ categorys: IYapiCategory[]; interfaces: IYapiInterfaceDescription[] }>(
                `${GET_YAPI_GROUP_URI}/${groupId}/project/${projectId}`,
                { params }
            )
            .catch(handleError);
    };
}

const YapiService = new YapiServiceClass();

export default YapiService;
