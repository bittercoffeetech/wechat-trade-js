import { Expose, Type } from 'class-transformer';

import { XmlModel } from '../decorators/XmlModel';
import { TradeCashFee } from './TradeCashFee';
import { TradeRefundInfo } from './TradeRefundInfo';

/**
 * 退款请求返回
 */
 export class TradeRefundQueryResponse extends TradeCashFee {
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
	@XmlModel('refunds', TradeRefundInfo, "refund_count")
	refunds?: TradeRefundInfo[];
}