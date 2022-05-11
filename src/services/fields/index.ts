import request from '@/common/api';
import { handleError } from '@/common/utils';

class FieldServiceClass {
    /* 获取接口字段列表 */
    getFieldListById = (id: number) => {
        return request.get<any>(`/fieldApi/field/showFields/query?id=${id}`).catch(handleError);
    };
    /* 更新接口字段列表 */
    postFieldListById = (id: number, fields: any[]) => {
        return request.post<any>(`/fieldApi/field/showFields/update`, {
            id,
            fields
        }).catch(handleError);
    };
}

const FieldService = new FieldServiceClass();

export default FieldService;
