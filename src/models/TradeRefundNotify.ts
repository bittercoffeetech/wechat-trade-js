import { Expose, Transform } from 'class-transformer';
import moment from 'moment';

import { RefundAccountEnum } from '../enums/RefundAccountEnum';
import { RefundRequestSourceEnum } from '../enums/RefundRequestSourceEnum';
import { RefundStatusEnum } from '../enums/RefundStatusEnum';
import { TradeFee } from './TradeFee';

/**
 * 退款结果通知
 */
 export class TradeRefundNotify extends TradeFee {

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
	@Transform(({ value }) => value || moment(value, 'YYYY-MM-DD hh:mm:ss'), { toClassOnly: true })
	successTime!: moment.Moment;
}