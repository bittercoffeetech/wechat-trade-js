import { TradeNo } from '../models/TradeNo';
import { TradeQueryResponse } from '../models/TradeQueryResponse';
import { DefaultTradeRequest } from './DefaultTradeRequest';
import { DefaultTradeResponse } from './DefaultTradeResponse';
import { TradeAction } from './TradeAction';

/**
 * 订单查询
 * 
 * @author BitterCoffee
 *
 */
 export const TradeQueryAction: TradeAction<TradeNo, TradeQueryResponse> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/orderquery",
		requestType: TradeNo,
		responseType: TradeQueryResponse
	}
};