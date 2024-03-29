import { SignTypeEnum } from '../enums/SignTypeEnum';
import { TradeFundflowInfo } from '../models/response/TradeFundflowInfo';
import { TradeFundflowRequest } from '../models/request/TradeFundflowRequest';
import { TradeFundflowSummaryInfo } from '../models/response/TradeFundflowSummaryInfo';
import { DefaultTradeRequest } from './DefaultTradeRequest';
import { TradeSheetAction } from './TradeSheetAction';

/**
 * 下载资金账单
 * 
 * @author BitterCoffee
 *
 */
export const TradeFundflowAction: TradeSheetAction<TradeFundflowRequest, TradeFundflowSummaryInfo, TradeFundflowInfo> = {
	...DefaultTradeRequest,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadfundflow",
		certificated: true,
		requestSignType: SignTypeEnum.HMAC_SHA256,
		requestType: TradeFundflowRequest,
		summaryType: TradeFundflowSummaryInfo,
		recordType: TradeFundflowInfo,
	}
};