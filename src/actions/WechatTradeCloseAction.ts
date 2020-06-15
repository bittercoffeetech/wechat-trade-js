import { WechatTradeAction, DefaultRequest, DefaultResponse } from "./WechatTradeAction";
import { TradeNoModel } from "../models/TradeCommonResponse";

/**
 * 关闭订单
 * 
 * @author BitterCoffee
 *
 */
export const WechatTradeCloseAction: WechatTradeAction<TradeNoModel, undefined> = {
	...DefaultRequest,
	...DefaultResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/closeorder",
		requestType: TradeNoModel,
		responseType: undefined
	}
};