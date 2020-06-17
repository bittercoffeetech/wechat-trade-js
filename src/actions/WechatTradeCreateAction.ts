import { TradeCreateModel, TradeCreateResponseModel } from '../models/TradeCreateModels';
import { DefaultRequest, DefaultResponse, WechatTradeAction } from './WechatTradeAction';

/**
 * 统一下单
 * 
 * @author BitterCoffee
 *
 */
export const WechatTradeCreateAction: WechatTradeAction<TradeCreateModel, TradeCreateResponseModel> = {
	...DefaultRequest,
	...DefaultResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
		hasHierarchy: true,
		requestType: TradeCreateModel,
		responseType: TradeCreateResponseModel,
	}
};