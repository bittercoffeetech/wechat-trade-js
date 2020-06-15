import { WechatTradeAction, DefaultRequest, DefaultResponse } from "./WechatTradeAction";
import { TradeRefundModel, TradeRefundResponseModel } from "../models/TradeRefundModels";

/**
 * 退款申请
 * 
 * @author BitterCoffee
 *
 */
export const WechatTradeRefundAction: WechatTradeAction<TradeRefundModel, TradeRefundResponseModel> = {
	...DefaultRequest,
	...DefaultResponse,
	...{
		url: "https://api.mch.weixin.qq.com/secapi/pay/refund",
		certificated: true,
		hasHierarchy: true,
		requestType: TradeRefundModel,
		responseType: TradeRefundResponseModel
	}
};