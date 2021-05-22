import { Expose } from 'class-transformer';

import { TradeNoInfo } from './TradeNoInfo';

/**
 * 金额相关
 */
 export class TradeFeeInfo extends TradeNoInfo {
	/**
	 * 标价金额 订单总金额，单位为分
	 */
	@Expose({ name: "total_fee" })
	totalFee!: number;

	/**
	 * 应结订单金额 当订单使用了免充值型优惠券后返回该参数，应结订单金额=订单金额-免充值优惠券金额。
	 */
	@Expose({ name: "settlement_total_fee" })
	settlementTotalFee!: number;
}