import { SignTypeEnum } from '../enums/commons';

/**
 * 通用请求内容定义
 */
export interface TradeRequest<R> {

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
 * 通用返回内容定义
 */
export interface TradeXmlResponse<S> {

	/**
	 * 获取返回对象的类型信息
	 */
	responseType: undefined | { new(...args: any[]): S; };

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
}

/**
 * 账单类型返回对象
 */
export interface TradeCsvResponse<ST, RT> {
	/**
	 * 概要信息对应的模型类
	 */
	summaryType: { new(...args: any[]) : ST };

	/**
	 * 详细信息对应的模型类
	 */
	recordType: { new(...args: any[]) : RT };
}

/**
 * 默认返回属性定义
 */
export const DefaultTradeResponse: Omit<TradeXmlResponse<any>, "responseType"> = {
	hasSigned: true,
	hasResult: true,
	hasHierarchy: false,
	responseSignType: SignTypeEnum.MD5,
	encrypted: undefined
}

/**
 * 默认请求属性定义
 */
export const DefaultTradeRequest: Omit<TradeRequest<any>, "requestType" | "url"> = {
	certificated: false,
	requestSignType: SignTypeEnum.MD5,
}

/**
 * 接口完整定义
 */
export interface TradeAction<R, S> extends TradeRequest<R>, TradeXmlResponse<S> {
	// no other things	
}

export interface TradeCsvAction<R, ST, RT> extends TradeRequest<R>, TradeCsvResponse<ST, RT> {
	// no other things.
}