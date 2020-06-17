import {
    TradeRefundQueryModel, TradeRefundQueryResponseModel
} from '../models/TradeRefundQueryModel';
import { DefaultRequest, DefaultResponse, WechatTradeAction } from './WechatTradeAction';

/**
 * 退款查询
 * 
 * @author BitterCoffee
 *
 */
export const WechatTradeRefundQueryAction: WechatTradeAction<TradeRefundQueryModel, TradeRefundQueryResponseModel> = {
	...DefaultRequest,
	...DefaultResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/refundquery",
		hasHierarchy: true,
		requestType: TradeRefundQueryModel,
		responseType: TradeRefundQueryResponseModel
	}
};