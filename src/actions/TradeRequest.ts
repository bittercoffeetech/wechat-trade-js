import { SignTypeEnum } from '../enums/SignTypeEnum';

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