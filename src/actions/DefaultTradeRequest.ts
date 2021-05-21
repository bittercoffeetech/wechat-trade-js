import { SignTypeEnum } from '../enums/SignTypeEnum';
import { TradeRequest } from './TradeRequest';

/**
 * 默认请求属性定义
 */
 export const DefaultTradeRequest: Omit<TradeRequest<any>, "requestType" | "url"> = {
	certificated: false,
	requestSignType: SignTypeEnum.MD5,
}