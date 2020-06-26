import { TradeCreateNotifyModel } from '../models/create_models';
import { TradeRefundNotifyModel } from '../models/refund_models';
import { DefaultTradeResponse, TradeXmlResponse } from './base';

/**
 * 支付结果通知
 * 
 * @author BitterCoffee
 *
 */
export const TradeCreateNotify: TradeXmlResponse<TradeCreateNotifyModel> = {
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
export const TradeRefundNotify: TradeXmlResponse<TradeRefundNotifyModel> = {
	...DefaultTradeResponse,
	...{
		encrypted: 'req_info',
		responseType: TradeRefundNotifyModel
	}
}