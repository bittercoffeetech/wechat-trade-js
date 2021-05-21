import { TradeRefundNotify } from '../models/TradeRefundNotify';
import { DefaultTradeResponse } from './DefaultTradeResponse';
import { TradeResponse } from './TradeResponse';

/**
 * 退款结果通知
 * 
 * @author BitterCoffee
 *
 */
export const TradeRefundNotifyAction: TradeResponse<TradeRefundNotify> = {
	...DefaultTradeResponse,
	...{
		hasResult: false,
		hasSigned: false,
		encrypted: 'req_info',
		responseType: TradeRefundNotify
	}
}