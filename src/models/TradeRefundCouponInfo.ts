import { Expose } from 'class-transformer';

import { XmlProperty } from '../decorators/XmlProperty';
import { CouponTypeEnum } from '../enums/CouponTypeEnum';

/**
 * 退款优惠券
 */
 export class TradeRefundCouponInfo {

	/**
	 * 代金券ID
	 */
	@Expose({ name: "coupon_refund_id" })
	@XmlProperty('coupon_refund_id')
	id!: string;

	/**
	 * 单个代金券支付金额
	 */
	@Expose({ name: "coupon_refund_fee" })
	@XmlProperty('coupon_refund_fee')
	fee!: number;

	/**
	 * 代金券类型 开通免充值券功能，并且订单使用了优惠券后有返回（取值：CASH、NO_CASH）。
	 * 
	 * @see CouponTypeEnum
	 */
	@Expose({ name: "coupon_type" })
	@XmlProperty('coupon_type')
	type!: CouponTypeEnum;

}