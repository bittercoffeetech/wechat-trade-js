import { TradeCreateRequest } from '../models/TradeCreateRequest';
import { TradeCreateResponse } from '../models/TradeCreateResponse';
import { DefaultTradeRequest } from './DefaultTradeRequest';
import { DefaultTradeResponse } from './DefaultTradeResponse';
import { TradeAction } from './TradeAction';

/**
 * 统一下单
 * 
 * @author BitterCoffee
 *
 */
 export const TradeCreateAction: TradeAction<TradeCreateRequest, TradeCreateResponse> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
		hasHierarchy: true,
		requestType: TradeCreateRequest,
		responseType: TradeCreateResponse,
	}
};