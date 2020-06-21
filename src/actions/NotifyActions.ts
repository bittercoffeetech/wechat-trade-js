import { TradeCreateNotifyModel } from '../models/TradeCreateModels';
import { TradeRefundNotifyModel } from '../models/TradeRefundModels';
import { DefaultTradeResponse, TradeResponse } from './TradeAction';

/**
 * 支付结果通知
 * 
 * @author BitterCoffee
 *
 */
export const TradeCreateNotify: TradeResponse<TradeCreateNotifyModel> = {
	...DefaultTradeResponse,
	...{
		hasHierarchy: true,
		responseType: TradeCreateNotifyModel
	}
}

/**
 * 退款结果通知
 * 
 * @author BitterCoffee
 *
 */
export const TradeRefundNotify: TradeResponse<TradeRefundNotifyModel> = {
	...DefaultTradeResponse,
	...{
		encrypted: 'req_info',
		responseType: TradeRefundNotifyModel
	}
}