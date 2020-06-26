import { SignTypeEnum } from '../enums/sign_type';
import {
    TradeBillAllInfo, TradeBillAllModel, TradeBillRefundInfo, TradeBillRefundModel, TradeBillSuccessInfo, TradeBillSuccessModel, TradeBillSummaryInfo,
    TradeFundflowInfo, TradeFundflowModel, TradeFundflowSummaryInfo
} from '../models/sheet_models';
import { DefaultTradeRequest, TradeCsvAction } from './base';

/**
 * 下载所有交易账单
 * 
 * @author BitterCoffee
 *
 */
export const TradeBillAllAction: TradeCsvAction<TradeBillAllModel, TradeBillSummaryInfo, TradeBillAllInfo> = {
	...DefaultTradeRequest,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadbill",
    	requestType: TradeBillAllModel,
		summaryType: TradeBillSummaryInfo,
		recordType: TradeBillAllInfo
	}
};

/**
 * 下载成功交易账单
 * 
 * @author BitterCoffee
 *
 */
export const TradeBillSuccessAction: TradeCsvAction<TradeBillSuccessModel, TradeBillSummaryInfo, TradeBillSuccessInfo> = {
	...DefaultTradeRequest,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadbill",
		requestType: TradeBillSuccessModel,
		summaryType: TradeBillSummaryInfo,
		recordType: TradeBillSuccessInfo
	}
};

/**
 * 下载退款交易账单
 * 
 * @author BitterCoffee
 *
 */
export const TradeBillRefundAction: TradeCsvAction<TradeBillRefundModel, TradeBillSummaryInfo, TradeBillRefundInfo> = {
	...DefaultTradeRequest,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadbill",
		requestType: TradeBillRefundModel,
		summaryType: TradeBillSummaryInfo,
		recordType: TradeBillRefundInfo
	}
};

/**
 * 下载资金账单
 * 
 * @author BitterCoffee
 *
 */
export const TradeFundflowAction: TradeCsvAction<TradeFundflowModel, TradeFundflowSummaryInfo, TradeFundflowInfo> = {
	...DefaultTradeRequest,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadfundflow",
		certificated: true,
		requestSignType: SignTypeEnum.HMAC_SHA256,
		requestType: TradeFundflowModel,
		summaryType: TradeFundflowSummaryInfo,
		recordType: TradeFundflowInfo,
	}
};