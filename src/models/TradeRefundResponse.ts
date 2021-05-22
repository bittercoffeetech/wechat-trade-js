import { Expose, Type } from 'class-transformer';

import { XmlProperty } from '../decorators/XmlProperty';
import { TradeCashFee } from './TradeCashFee';
import { TradeRefundCouponInfo } from './TradeRefundCouponInfo';

/**
 * 退款请求返回
 */
 export class TradeRefundResponse extends TradeCashFee {
	/**
	 * 商户退款单号 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
	 */
	@Expose({ name: "out_refund_no" })
	refundNo!: string;

	/**
	 * 微信退款单号 微信生成的退款单号，在申请退款接口有返回
	 */
	@Expose({ name: "refund_id" })
	refundId!: string;

	/**
	 * 退款金额 退款总金额，订单总金额，单位为分，只能为整数
	 */
	@Expose({ name: "refund_fee" })
	refundFee!: number;

	/**
	 * 现金退款金额 现金退款金额，单位为分，只能为整数
	 */
	@Expose({ name: "cash_refund_fee" })
	cashRefundFee?: number;

	/**
	 * 应结退款金额 去掉非充值代金券退款金额后的退款金额，退款金额=申请退款金额-非充值代金券退款金额，退款金额&lt;=申请退款金额
	 */
	@Expose({ name: "settlement_refund_fee" })
	settlementRefundFee?: number;

	/**
	 * 代金券使用数量
	 */
	@Expose({ name: "coupon_refund_count" })
	couponCount?: number;

	/**
	 * 代金券金额 “代金券”金额&lt;=订单金额，订单金额-“代金券”金额=现金支付金额
	 */
	@Expose({ name: "coupon_refund_fee" })
	couponFee?: number;

	/**
	 * 代金券
	 * 
	 * @see TradeRefundCouponInfo
	 */
	@Expose({ name: "coupons" })
	@Type(() => TradeRefundCouponInfo)
	@XmlProperty('coupons', TradeRefundCouponInfo, "coupon_refund_count")
	coupons?: TradeRefundCouponInfo[];

}