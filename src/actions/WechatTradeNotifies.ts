import { WechatTradeResponse, DefaultResponse } from "./WechatTradeAction"
import { TradeCreateNotifyModel } from "../models/TradeCreateModels"
import { TradeRefundNotifyModel } from "../models/TradeRefundModels"

/**
 * 支付结果通知
 * 
 * @author BitterCoffee
 *
 */
export const WechatTradeCreateNotify: WechatTradeResponse<TradeCreateNotifyModel> = {
	...DefaultResponse,
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
export const WechatTradeRefundNotify: WechatTradeResponse<TradeRefundNotifyModel> = {
	...DefaultResponse,
	...{
		encrypted: 'req_info',
		responseType: TradeRefundNotifyModel
	}
}