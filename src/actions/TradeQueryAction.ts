import { TradeNoInfo } from '../models/request/TradeNoInfo';
import { TradeQueryResponse } from '../models/response/TradeQueryResponse';
import { DefaultTradeRequest } from './DefaultTradeRequest';
import { DefaultTradeResponse } from './DefaultTradeResponse';
import { TradeAction } from './TradeAction';

/**
 * 订单查询
 * 
 * @author BitterCoffee
 *
 */
 export const TradeQueryAction: TradeAction<TradeNoInfo, TradeQueryResponse> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/orderquery",
		requestType: TradeNoInfo,
		responseType: TradeQueryResponse
	}
};