import { SignTypeEnum } from '../enums/SignTypeEnum';
import {
    TradeBillAllModel, TradeBillAllResponseModel, TradeBillRefundModel,
    TradeBillRefundResponseModel, TradeBillSuccessModel, TradeBillSuccessResponseModel,
    TradeFundflowModel, TradeFundflowResponseModel
} from '../models/TradeSheetModels';
import { TradeAction, DefaultTradeRequest, DefaultTradeResponse } from './TradeAction';

/**
 * 下载所有交易账单
 * 
 * @author BitterCoffee
 *
 */
export const TradeBillAllAction: TradeAction<TradeBillAllModel, TradeBillAllResponseModel> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadbill",
		hasSigned: false,
		hasHierarchy: false,
		isStreaming: true,
		requestType: TradeBillAllModel,
		responseType: TradeBillAllResponseModel
	}
};

/**
 * 下载成功交易账单
 * 
 * @author BitterCoffee
 *
 */
export const TradeBillSuccessAction: TradeAction<TradeBillSuccessModel, TradeBillSuccessResponseModel> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadbill",
		hasSigned: false,
		hasHierarchy: false,
		isStreaming: true,
		requestType: TradeBillSuccessModel,
		responseType: TradeBillSuccessResponseModel
	}
};

/**
 * 下载退款交易账单
 * 
 * @author BitterCoffee
 *
 */
export const TradeBillRefundAction: TradeAction<TradeBillRefundModel, TradeBillRefundResponseModel> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadbill",
		hasSigned: false,
		hasHierarchy: false,
		isStreaming: true,
		requestType: TradeBillRefundModel,
		responseType: TradeBillRefundResponseModel
	}
};

/**
 * 下载资金账单
 * 
 * @author BitterCoffee
 *
 */
export const TradeFundflowAction: TradeAction<TradeFundflowModel, TradeFundflowResponseModel> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadfundflow",
		certificated: true,
		requestSignType: SignTypeEnum.HMAC_SHA256,
		hasSigned: false,
		hasHierarchy: false,
		isStreaming: true,
		requestType: TradeFundflowModel,
		responseType: TradeFundflowResponseModel
	}
};