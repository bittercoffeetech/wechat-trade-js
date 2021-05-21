
import { TradeCreateNotify } from '../models/TradeCreateNotify';
import { DefaultTradeResponse } from './DefaultTradeResponse';
import { TradeResponse } from './TradeResponse';

/**
 * 支付结果通知
 * 
 * @author BitterCoffee
 *
 */
 export const TradeCreateNotifyAction: TradeResponse<TradeCreateNotify> = {
	...DefaultTradeResponse,
	...{
		hasHierarchy: true,
		responseType: TradeCreateNotify
	}
}