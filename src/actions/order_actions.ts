import { TradeNoModel } from '../models/base';
import { TradeCreateModel, TradeCreateResponseModel } from '../models/create_models';
import { TradeQueryResponseModel } from '../models/query_models';
import { TradeRefundModel, TradeRefundResponseModel } from '../models/refund_models';
import { TradeRefundQueryModel, TradeRefundQueryResponseModel } from '../models/refund_query_models';
import { DefaultTradeRequest, DefaultTradeResponse, TradeAction } from './base';

/**
 * 统一下单
 * 
 * @author BitterCoffee
 *
 */
export const TradeCreateAction: TradeAction<TradeCreateModel, TradeCreateResponseModel> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/unifiedorder",
		hasHierarchy: true,
		requestType: TradeCreateModel,
		responseType: TradeCreateResponseModel,
	}
};

/**
 * 关闭订单
 * 
 * @author BitterCoffee
 *
 */
export const TradeCloseAction: TradeAction<TradeNoModel, undefined> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/closeorder",
		requestType: TradeNoModel,
		responseType: undefined //TradeEmptyResponseModel
	}
};

/**
 * 订单查询
 * 
 * @author BitterCoffee
 *
 */
export const TradeQueryAction: TradeAction<TradeNoModel, TradeQueryResponseModel> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/orderquery",
		requestType: TradeNoModel,
		responseType: TradeQueryResponseModel
	}
};

/**
 * 退款申请
 * 
 * @author BitterCoffee
 *
 */
export const TradeRefundAction: TradeAction<TradeRefundModel, TradeRefundResponseModel> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/secapi/pay/refund",
		certificated: true,
		hasHierarchy: true,
		requestType: TradeRefundModel,
		responseType: TradeRefundResponseModel
	}
};

/**
 * 退款查询
 * 
 * @author BitterCoffee
 *
 */
export const TradeRefundQueryAction: TradeAction<TradeRefundQueryModel, TradeRefundQueryResponseModel> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/refundquery",
		hasHierarchy: true,
		requestType: TradeRefundQueryModel,
		responseType: TradeRefundQueryResponseModel
	}
};