import { TradeBillSuccessInfo } from '../models/TradeBillSuccessInfo';
import { TradeBillSuccessRequest } from '../models/TradeBillSuccessRequest';
import { TradeBillSummaryInfo } from '../models/TradeBillSummaryInfo';
import { DefaultTradeRequest } from './DefaultTradeRequest';
import { TradeSheetAction } from './TradeSheetAction';

/**
 * 下载成功交易账单
 * 
 * @author BitterCoffee
 *
 */
 export const TradeBillSuccessAction: TradeSheetAction<TradeBillSuccessRequest, TradeBillSummaryInfo, TradeBillSuccessInfo> = {
	...DefaultTradeRequest,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadbill",
		requestType: TradeBillSuccessRequest,
		summaryType: TradeBillSummaryInfo,
		recordType: TradeBillSuccessInfo
	}
};