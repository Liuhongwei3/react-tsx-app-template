
import { createContext } from 'react';
import { makeAutoObservable } from "mobx"
import { IApiDetail } from '@/services/yapi/type';

class Store {
    showApiId: number | undefined = undefined;
    curApi: IApiDetail | undefined = undefined;
    showFields: any[] = [];

    constructor() {
        makeAutoObservable(this)
    }

    setShowApiId(id: number) {
        this.showApiId = id;
    }

    setCurApi(curApi: IApiDetail) {
        this.curApi = curApi;
    }

    setShowFields(fields: any[]) {
        this.showFields = fields.map(field => field?.fieldName ? field : ({
            ...field,
            fieldName: field.fieldKey
        }));
    }
}

export const StoresContext = createContext(new Store());
