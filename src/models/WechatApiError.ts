/**
 * 接口调用返回的错误信息封装的异常类
 */
 export class WechatApiError extends Error {
    code: string;
    constructor(code: string, message?: string) {
        super(message);
        this.code = code;
    }
}