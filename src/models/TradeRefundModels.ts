import { Expose, Type } from 'class-transformer';
import { Moment } from 'moment';

import { ApiField } from '../decorators';
import { FeeTypeEnum } from '../enums/FeeTypeEnum';
import { RefundAccountEnum } from '../enums/RefundAccountEnum';
import { RefundRequestSourceEnum } from '../enums/RefundRequestSourceEnum';
import { RefundStatusEnum } from '../enums/RefundStatusEnum';
import {
    TradeCashFeeModel, TradeFeeModel, TradeNoModel, TradeRefundCouponInfo
} from './TradeCommons';

export class TradeRefundModel extends TradeNoModel {
    /**
	 * 标价金额 订单总金额，单位为分
	 */
	@Expose({ name: "total_fee" })
	totalFee!: number;

	/**
	 * 商户退款单号 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
	 */
	@Expose({ name: "out_refund_no" })
	refundNo!: string;

	/**
	 * 退款金额 退款总金额，订单总金额，单位为分，只能为整数
	 */
	@Expose({ name: "refund_fee" })
	refundFee!: number;

	/**
	 * 符合ISO 4217标准的三位字母代码，默认人民币：CNY
	 */
	@Expose({ name: "refund_fee_type" })
	refundFeeType?: FeeTypeEnum = FeeTypeEnum.CNY;

	/**
	 * 退款资金来源 仅针对老资金流商户使用
	 * 
	 * @see RefundAccountEnum
	 */
	@Expose({ name: "refund_account" })
	refundAccount?: RefundAccountEnum;

	/**
	 * 退款原因 若商户传入，会在下发给用户的退款消息中体现退款原因 注意：若订单退款金额≤1元，且属于部分退款，则不会在退款消息中体现退款原因
	 */
	@Expose({ name: "refund_desc" })
	refundDesc?: string;

	/**
	 * 通知地址 异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
	 */
	@Expose({ name: "notify_url" })
	notifyUrl?: string;

}
export class TradeRefundResponseModel extends TradeCashFeeModel {
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
	@ApiField('coupons', TradeRefundCouponInfo, "coupon_refund_count")
	coupons?: TradeRefundCouponInfo[];

}

export class TradeRefundNotifyModel extends TradeFeeModel {

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
	 * 应结退款金额 去掉非充值代金券退款金额后的退款金额，退款金额=申请退款金额-非充值代金券退款金额，退款金额&lt;=申请退款金额
	 */
	@Expose({ name: "settlement_refund_fee" })
	settlementRefundFee?: number;

	/**
	 * 退款状态
	 */
	@Expose({ name: "refund_status" })
	refundStatus!: RefundStatusEnum;

	/**
	 * 退款资金来源 仅针对老资金流商户使用
	 * 
	 * @see RefundAccountEnum
	 */
	@Expose({ name: "refund_account" })
	refundAccount?: RefundAccountEnum;

	/**
	 * 退款入账账户
	 */
	@Expose({ name: "refund_recv_accout" })
	refundRecvAccout?: string;

	/**
	 * 退款发起来源
	 */
	@Expose({ name: "refund_request_source" })
	refundRequestSource?: RefundRequestSourceEnum;

	/**
	 * 退款成功时间 资金退款至用户帐号的时间，格式2017-12-15 09:46:01
	 */
	@Expose({ name: "success_time" })
	successTime!: Moment;
}