import { SignTypeEnum } from '../enums/SignTypeEnum';
import {
    TradeBillAllModel, TradeBillRefundModel,
    TradeBillSuccessModel, 
    TradeFundflowModel, TradeBillSummaryInfo, TradeBillAllInfo, TradeBillSuccessInfo, TradeBillRefundInfo, TradeFundflowSummaryInfo, TradeFundflowInfo
} from '../models/TradeSheetModels';
import { DefaultTradeRequest, DefaultTradeResponse, TradeCsvAction } from './TradeAction';

/**
 * 下载所有交易账单
 * 
 * @author BitterCoffee
 *
 */
export const TradeBillAllAction: TradeCsvAction<TradeBillAllModel, TradeBillSummaryInfo, TradeBillAllInfo> = {
	...DefaultTradeRequest,
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadbill",
		hasSigned: false,
		hasHierarchy: false,
		isStreaming: true,
		requestType: TradeBillAllModel,
		responseType: undefined,
		summaryType(): new(...args: any[]) => TradeBillSummaryInfo {
			return TradeBillSummaryInfo;
		},
		recordType(): new(...args: any[]) => TradeBillAllInfo {
			return TradeBillAllInfo;
		}
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
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadbill",
		hasSigned: false,
		hasHierarchy: false,
		isStreaming: true,
		requestType: TradeBillSuccessModel,
		responseType: undefined,
		summaryType(): new(...args: any[]) => TradeBillSummaryInfo {
			return TradeBillSummaryInfo;
		},
		recordType(): new(...args: any[]) => TradeBillSuccessInfo {
			return TradeBillSuccessInfo;
		}
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
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadbill",
		hasSigned: false,
		hasHierarchy: false,
		isStreaming: true,
		requestType: TradeBillRefundModel,
		responseType: undefined,
		summaryType(): new(...args: any[]) => TradeBillSummaryInfo {
			return TradeBillSummaryInfo;
		},
		recordType(): new(...args: any[]) => TradeBillRefundInfo {
			return TradeBillRefundInfo;
		}
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
	...DefaultTradeResponse,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadfundflow",
		certificated: true,
		requestSignType: SignTypeEnum.HMAC_SHA256,
		hasSigned: false,
		hasHierarchy: false,
		isStreaming: true,
		requestType: TradeFundflowModel,
		responseType: undefined,
		summaryType(): new(...args: any[]) => TradeFundflowSummaryInfo {
			return TradeFundflowSummaryInfo;
		},
		recordType(): new(...args: any[]) => TradeFundflowInfo {
			return TradeFundflowInfo;
		}
	}
};