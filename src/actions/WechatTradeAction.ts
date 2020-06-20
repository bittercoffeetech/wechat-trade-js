import { Expose } from 'class-transformer';
import { Readable } from 'stream';

import { SignTypeEnum } from '../enums/SignTypeEnum';

/**
 * 通用返回内容定义
 */
export interface WechatTradeResponse<S> {

	/**
	 * 获取返回对象的类型信息
	 */
	responseType: { new(...args: any[]): S; } | undefined;

	/**
	 * 返回值中是否包括签名字段
	 */
	hasSigned: boolean;

	/**
	 * 返回值中是否业务结果信息
	 */
	hasResult: boolean;

	/**
	 * 加密字段名
	 */
	encrypted: string | undefined;

	/**
	 * 是否包含嵌套对象
	 */
	hasHierarchy: boolean;

	/**
	 * 签名算法
	 */
	responseSignType: SignTypeEnum;

	/**
     * 是否返回流数据
     */
	isStreaming: boolean;

}

/**
 * 通用请求内容定义
 */
export interface WechatTradeRequest<R> {

	/**
	 * 获取请求对象类型
	 */
	requestType: { new(...args: any[]): R; };

	/**
	 * 返回接口地址
	 */
	url: string;

	/**
	 * 是否需要安全证书
	 */
	certificated: boolean;

	/**
	 * 签名算法
	 */
	requestSignType: SignTypeEnum;

}

/**
 * 默认返回属性定义
 */
export const DefaultResponse: Omit<WechatTradeResponse<any>, "responseType"> = {
	hasSigned: true,
	hasResult: true,
	hasHierarchy: false,
	isStreaming: false,
	responseSignType: SignTypeEnum.MD5,
	encrypted: undefined
}

/**
 * 默认请求属性定义
 */
export const DefaultRequest: Omit<WechatTradeRequest<any>, "requestType" | "url"> = {
	certificated: false,
	requestSignType: SignTypeEnum.MD5,
}

/**
 * 接口完整定义
 */
export interface WechatTradeAction<R, S> extends WechatTradeRequest<R>, WechatTradeResponse<S> {
	// no other things	
}