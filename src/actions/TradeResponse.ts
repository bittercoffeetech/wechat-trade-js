import { SignTypeEnum } from '../enums/SignTypeEnum';

/**
 * 通用返回内容定义
 */
 export interface TradeResponse<S> {

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