import { Expose, Type } from 'class-transformer';

import { XmlProperty } from '../../decorators/XmlProperty';
import { TradeCashFeeInfo } from './TradeCashFeeInfo';
import { TradeRefundInfo } from './TradeRefundInfo';

/**
 * 退款请求返回
 */
 export class TradeRefundQueryResponse extends TradeCashFeeInfo {
	/**
	 * 退款笔数
	 */
	@Expose({ name: "refund_count" })
	refundCount!: number;

	/**
	 * 退款笔数
	 */
	@Expose({ name: "refund_fee" })
	refundFee!: number;

	/**
	 * 退款详情
	 */
	@Expose({ name: "refunds" })
	@Type(() => TradeRefundInfo)
	@XmlProperty('refunds', TradeRefundInfo, "refund_count")
	refunds?: TradeRefundInfo[];
}