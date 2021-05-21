import { TradeBillAllInfo } from '../models/TradeBillAllInfo';
import { TradeBillAllRequest } from '../models/TradeBillAllRequest';
import { TradeBillSummaryInfo } from '../models/TradeBillSummaryInfo';
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