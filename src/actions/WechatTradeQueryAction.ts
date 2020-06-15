import { WechatTradeAction, DefaultRequest, DefaultResponse } from "./WechatTradeAction";import { TradeNoModel } from "../models/TradeCommonResponse";import { TradeQueryResponseModel } from "../models/TradeQueryModels";

/**
 * 订单查询
 * 
 * @author BitterCoffee
 *
 */
export const WechatTradeQueryAction: WechatTradeAction<TradeNoModel, TradeQueryResponseModel> = {
	...DefaultRequest,
	...DefaultResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/orderquery",
		requestType: TradeNoModel,
		responseType: TradeQueryResponseModel
	}
};
