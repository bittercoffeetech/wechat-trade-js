import { TradeRefundRequest } from '../models/TradeRefundRequest';
import { TradeRefundResponse } from '../models/TradeRefundResponse';
import { DefaultTradeRequest } from './DefaultTradeRequest';
import { DefaultTradeResponse } from './DefaultTradeResponse';
import { TradeAction } from './TradeAction';

/**
 * 退款申请
 * 
 * @author BitterCoffee
 *
 */
 export const TradeRefundAction: TradeAction<TradeRefundRequest, TradeRefundResponse> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/secapi/pay/refund",
		certificated: true,
		hasHierarchy: true,
		requestType: TradeRefundRequest,
		responseType: TradeRefundResponse
	}
};