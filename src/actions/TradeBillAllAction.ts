import { TradeBillAllInfo } from '../models/response/TradeBillAllInfo';
import { TradeBillAllRequest } from '../models/request/TradeBillAllRequest';
import { TradeBillSummaryInfo } from '../models/response/TradeBillSummaryInfo';
import { DefaultTradeRequest } from './DefaultTradeRequest';
import { TradeSheetAction } from './TradeSheetAction';

/**
 * 下载所有交易账单
 * 
 * @author BitterCoffee
 *
 */
 export const TradeBillAllAction: TradeSheetAction<TradeBillAllRequest, TradeBillSummaryInfo, TradeBillAllInfo> = {
	...DefaultTradeRequest,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadbill",
    	requestType: TradeBillAllRequest,
		summaryType: TradeBillSummaryInfo,
		recordType: TradeBillAllInfo
	}
};