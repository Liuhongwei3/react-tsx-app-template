import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

interface IWithExtendAxiosRequestConfig extends AxiosRequestConfig {
    needHeaders?: boolean;  // 是否返回 response 的 headers
}

declare module 'axios' {
    export interface AxiosInstance {
        get<T = any>(url: string, config?: IWithExtendAxiosRequestConfig ): Promise<T>;
        // 如果确定不再使用原来的声明，可以直接写成：
        // get<R = any> (url: string, config?: AxiosRequestConfig): Promise<R>;
        post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        delete<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
        // ...其他方法按需增加声明
    }
}
