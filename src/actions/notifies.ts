import { TradeCreateNotifyModel } from '../models/pay';
import { TradeRefundNotifyModel } from '../models/refund';
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
		hasResult: false,
		hasSigned: false,
		encrypted: 'req_info',
		responseType: TradeRefundNotifyModel
	}
}