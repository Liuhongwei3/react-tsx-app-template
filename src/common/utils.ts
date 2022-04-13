import { toast } from "@qunhe/muya-ui";

export const handleError = (err: Error): never => {
    toast.error(err.message || '出错了');
    console.error(err);
    throw err;
};
