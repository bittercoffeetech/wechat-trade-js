import { TradeBillRefundInfo } from '../models/TradeBillRefundInfo';
import { TradeBillRefundRequest } from '../models/TradeBillRefundRequest';
import { TradeBillSummaryInfo } from '../models/TradeBillSummaryInfo';
import { DefaultTradeRequest } from './DefaultTradeRequest';
import { TradeSheetAction } from './TradeSheetAction';

/**
 * 下载退款交易账单
 * 
 * @author BitterCoffee
 *
 */
 export const TradeBillRefundAction: TradeSheetAction<TradeBillRefundRequest, TradeBillSummaryInfo, TradeBillRefundInfo> = {
	...DefaultTradeRequest,
	...{
		url: "https://api.mch.weixin.qq.com/pay/downloadbill",
		requestType: TradeBillRefundRequest,
		summaryType: TradeBillSummaryInfo,
		recordType: TradeBillRefundInfo
	}
};