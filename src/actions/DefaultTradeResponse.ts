import { SignTypeEnum } from '../enums/SignTypeEnum';
import { TradeResponse } from './TradeResponse';

/**
 * 默认返回属性定义
 */
 export const DefaultTradeResponse: Omit<TradeResponse<any>, "responseType"> = {
	hasSigned: true,
	hasResult: true,
	hasHierarchy: false,
	responseSignType: SignTypeEnum.MD5,
	encrypted: undefined
}