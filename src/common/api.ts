import { toast } from '@qunhe/muya-ui';
import axios from 'axios';
import { IWithExtendAxiosRequestConfig } from '../@types/axios';
import { yapiToken } from './const';

const axiosInst = axios.create({
    headers: {
        Accept: '*/*',
        'x-auth-token': yapiToken
    },
    // adapter: cacheAdapterEnhancer(axios.defaults.adapter!, { enabledByDefault: false, cacheFlag: 'useCache' }),
});

const isRelativeURL = (url?: string) => {
    if (!url) {
        return false;
    }
    if (url.includes('http://') || url.includes('https://')) {
        return false;
    }
    return true;
};

function _parseResponseData(data: any) {
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }
    return data;
}

function _matchWebstandard(data: any) {
    // 存在 data 非 interable的情况
    try {
        return 'c' in data;
    } catch (error) {
        return false;
    }
}

axiosInst.interceptors.response.use(
    (response) => {
        const data = _parseResponseData(response.data);

        // 需要 headers 的请求返回 headers
        if ((response.config as IWithExtendAxiosRequestConfig)?.needHeaders) {
            return { headers: response.headers, d: data };
        }

        if (!_matchWebstandard(data)) {
            return data;
        }

        const { c, m, d } = data;

        if (parseInt(c, 10) !== 0) {
            if (m) {
                console.error(m);
            }
            return Promise.reject(new Error(m || '服务器开小差了~'));
        }
        return d;
    },
    (error) => {
        // 当 401 重定向到登录页
        if (error && error.response && error.response.status === 401) {
            toast.warning("请先登录");
            window.location.href = '/';
            return;
        }
        return Promise.reject(error.response);
    }
);

export default axiosInst;
