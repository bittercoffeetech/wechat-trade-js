import { SignTypeEnum } from '../enums/SignTypeEnum';
import {
    TradeBillAllModel, TradeBillAllResponseModel, TradeBillRefundModel,
    TradeBillRefundResponseModel, TradeBillSuccessModel, TradeBillSuccessResponseModel,
    TradeFundflowModel, TradeFundflowResponseModel
} from '../models/TradeSheetModels';
import { DefaultRequest, DefaultResponse, WechatTradeAction } from './WechatTradeAction';

/**
 * 下载所有交易账单
 * 
 * @author BitterCoffee
 *
 */
export const WechatTradeBillAllAction: WechatTradeAction<TradeBillAllModel, TradeBillAllResponseModel> = {
	...DefaultRequest,
	...DefaultResponse,
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
export const WechatTradeBillSuccessAction: WechatTradeAction<TradeBillSuccessModel, TradeBillSuccessResponseModel> = {
	...DefaultRequest,
	...DefaultResponse,
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
export const WechatTradeBillRefundAction: WechatTradeAction<TradeBillRefundModel, TradeBillRefundResponseModel> = {
	...DefaultRequest,
	...DefaultResponse,
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
export const WechatTradeFundflowAction: WechatTradeAction<TradeFundflowModel, TradeFundflowResponseModel> = {
	...DefaultRequest,
	...DefaultResponse,
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