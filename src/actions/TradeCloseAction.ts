import { TradeNo } from '../models/TradeNo';
import { DefaultTradeRequest } from './DefaultTradeRequest';
import { DefaultTradeResponse } from './DefaultTradeResponse';
import { TradeAction } from './TradeAction';

/**
 * 关闭订单
 * 
 * @author BitterCoffee
 *
 */
 export const TradeCloseAction: TradeAction<TradeNo, undefined> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/closeorder",
		requestType: TradeNo,
		responseType: undefined //TradeEmptyResponseModel
	}
};