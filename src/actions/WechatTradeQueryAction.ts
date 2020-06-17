import { TradeNoModel } from '../models/TradeCommonResponse';
import { TradeQueryResponseModel } from '../models/TradeQueryModels';
import { DefaultRequest, DefaultResponse, WechatTradeAction } from './WechatTradeAction';

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
