import { TradeRefundQueryRequest } from '../models/request/TradeRefundQueryRequest';
import { TradeRefundQueryResponse } from '../models/response/TradeRefundQueryResponse';
import { DefaultTradeRequest } from './DefaultTradeRequest';
import { DefaultTradeResponse } from './DefaultTradeResponse';
import { TradeAction } from './TradeAction';

/**
 * 退款查询
 * 
 * @author BitterCoffee
 *
 */
export const TradeRefundQueryAction: TradeAction<TradeRefundQueryRequest, TradeRefundQueryResponse> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/refundquery",
		hasHierarchy: true,
		requestType: TradeRefundQueryRequest,
		responseType: TradeRefundQueryResponse
	}
};