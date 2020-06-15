import { Moment } from 'moment';
import { TradeNoModel, TradeCashFeeModel, TradeRefundCouponInfo } from './TradeCommonResponse';
import { Expose, Type } from "class-transformer";
import { RefundStatusEnum } from '../enums/RefundStatusEnum';
import { RefundAccountEnum } from '../enums/RefundAccountEnum';
import { RefundChannelEnum } from '../enums/RefundChannelEnum';
import { ApiField } from '../decorators';
import "reflect-metadata";

export class TradeRefundQueryModel extends TradeNoModel {
    /**
	 * 商户退款单号 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
	 */
	@Expose({ name: "out_refund_no" })
    refundNo!: string;

	/**
	 * 微信退款单号 微信生成的退款单号，在申请退款接口有返回
	 */
    @Expose({ name: "refund_id" })
    refundId?: string;

	/**
	 * 偏移量 偏移量，当部分退款次数超过10次时可使用，表示返回的查询结果从这个偏移量开始取记录
	 */
    @Expose({ name: "offset" })
    offset?: number;
}

export class TradeRefundInfo {
	/**
	 * 商户退款单号 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
	 */
	@Expose({ name: "out_refund_no" })
	@ApiField('out_refund_no')
	refundNo!: string;

	/**
	 * 微信退款单号 微信生成的退款单号，在申请退款接口有返回
	 */
	@Expose({ name: "refund_id" })
	@ApiField('refund_id')
	refundId!: string;

	/**
	 * 退款金额 退款总金额，订单总金额，单位为分，只能为整数
	 */
	@Expose({ name: "refund_fee" })
	@ApiField('refund_fee')
	refundFee!: number;

	/**
	 * 应结退款金额 去掉非充值代金券退款金额后的退款金额，退款金额=申请退款金额-非充值代金券退款金额，退款金额&lt;=申请退款金额
	 */
	@Expose({ name: "settlement_refund_fee" })
	@ApiField('settlement_refund_fee')
	settlementRefundFee?: number;

	/**
	 * 退款状态
	 */
	@Expose({ name: "refund_status" })
	@ApiField('refund_status')
	refundStatus!: RefundStatusEnum;

	/**
	 * 退款资金来源 仅针对老资金流商户使用
	 * 
	 * @see RefundAccountEnum
	 */
	@Expose({ name: "refund_account" })
	@ApiField('refund_account')
	refundAccount?: RefundAccountEnum;

	/**
	 * 退款入账账户
	 */
	@Expose({ name: "refund_recv_accout" })
	@ApiField('refund_recv_accout')
	refundRecvAccout?: string;

	/**
	 * 退款渠道
	 */
	@Expose({ name: "refund_channel" })
	@ApiField('refund_channel')
	refundChannel!: RefundChannelEnum;

	/**
	 * 退款成功时间 资金退款至用户帐号的时间，格式2017-12-15 09:46:01
	 */
	@Expose({ name: "refund_success_time" })
	@ApiField('refund_success_time')
	successTime!: Moment;

	/**
	 * 代金券使用数量
	 */
	@Expose({ name: "coupon_refund_count" })
	@ApiField('coupon_refund_count')
	couponCount?: number;

	/**
	 * 代金券金额 “代金券”金额&lt;=订单金额，订单金额-“代金券”金额=现金支付金额
	 */
	@Expose({ name: "coupon_refund_fee" })
	@ApiField('coupon_refund_fee')
	couponFee?: number;

	/**
	 * 代金券
	 * 
	 * @see TradeRefundCouponInfo
	 */
	@Expose({ name: "coupons" })
	@Type(() => TradeRefundCouponInfo)
	@ApiField('coupons', TradeRefundCouponInfo, "coupon_refund_count")
	coupons?: TradeRefundCouponInfo[];
}

export class TradeRefundQueryResponseModel extends TradeCashFeeModel {
	/**
	 * 退款笔数
	 */
	@Expose({name: "refund_count"})
	refundCount!:number;

	/**
	 * 退款笔数
	 */
	@Expose({name: "refund_fee" })
	refundFee!:number;

	/**
	 * 退款详情
	 */
	@Expose({name:  "refunds"})
	@Type(() => TradeRefundInfo)	
	@ApiField('refunds', TradeRefundInfo, "refund_count")
	refunds?: TradeRefundInfo[];
}