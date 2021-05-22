import { TradeNoInfo } from '../models/TradeNoInfo';
import { DefaultTradeRequest } from './DefaultTradeRequest';
import { DefaultTradeResponse } from './DefaultTradeResponse';
import { TradeAction } from './TradeAction';

/**
 * 关闭订单
 * 
 * @author BitterCoffee
 *
 */
 export const TradeCloseAction: TradeAction<TradeNoInfo, undefined> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/closeorder",
		requestType: TradeNoInfo,
		responseType: undefined //TradeEmptyResponseModel
	}
};