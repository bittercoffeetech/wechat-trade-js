import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { XmlProperty } from '../../decorators/XmlProperty';
import { RefundAccountEnum } from '../../enums/RefundAccountEnum';
import { RefundChannelEnum } from '../../enums/RefundChannelEnum';
import { RefundStatusEnum } from '../../enums/RefundStatusEnum';
import { TradeRefundCouponInfo } from './TradeRefundCouponInfo';

/**
 * 退款详情
 */
 export class TradeRefundInfo {
	/**
	 * 商户退款单号 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
	 */
	@Expose({ name: "out_refund_no" })
	@XmlProperty('out_refund_no')
	refundNo!: string;

	/**
	 * 微信退款单号 微信生成的退款单号，在申请退款接口有返回
	 */
	@Expose({ name: "refund_id" })
	@XmlProperty('refund_id')
	refundId!: string;

	/**
	 * 退款金额 退款总金额，订单总金额，单位为分，只能为整数
	 */
	@Expose({ name: "refund_fee" })
	@XmlProperty('refund_fee')
	refundFee!: number;

	/**
	 * 应结退款金额 去掉非充值代金券退款金额后的退款金额，退款金额=申请退款金额-非充值代金券退款金额，退款金额&lt;=申请退款金额
	 */
	@Expose({ name: "settlement_refund_fee" })
	@XmlProperty('settlement_refund_fee')
	settlementRefundFee?: number;

	/**
	 * 退款状态
	 */
	@Expose({ name: "refund_status" })
	@XmlProperty('refund_status')
	refundStatus!: RefundStatusEnum;

	/**
	 * 退款资金来源 仅针对老资金流商户使用
	 * 
	 * @see RefundAccountEnum
	 */
	@Expose({ name: "refund_account" })
	@XmlProperty('refund_account')
	refundAccount?: RefundAccountEnum;

	/**
	 * 退款入账账户
	 */
	@Expose({ name: "refund_recv_accout" })
	@XmlProperty('refund_recv_accout')
	refundRecvAccout?: string;

	/**
	 * 退款渠道
	 */
	@Expose({ name: "refund_channel" })
	@XmlProperty('refund_channel')
	refundChannel!: RefundChannelEnum;

	/**
	 * 退款成功时间 资金退款至用户帐号的时间，格式2017-12-15 09:46:01
	 */
	@Expose({ name: "refund_success_time" })
	@XmlProperty('refund_success_time')
	@Transform(({ value }) => value || moment(value, 'YYYY-MM-DD hh:mm:ss'), { toClassOnly: true })
	successTime!: moment.Moment;	

	/**
	 * 代金券使用数量
	 */
	@Expose({ name: "coupon_refund_count" })
	@XmlProperty('coupon_refund_count')
	couponCount?: number;

	/**
	 * 代金券金额 “代金券”金额&lt;=订单金额，订单金额-“代金券”金额=现金支付金额
	 */
	@Expose({ name: "coupon_refund_fee" })
	@XmlProperty('coupon_refund_fee')
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