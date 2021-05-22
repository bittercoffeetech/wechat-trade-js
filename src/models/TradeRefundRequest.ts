import { Expose } from 'class-transformer';
import { customAlphabet } from 'nanoid';

import { FeeTypeEnum } from '../enums/FeeTypeEnum';
import { RefundAccountEnum } from '../enums/RefundAccountEnum';
import { TradeId, TradeNoInfo } from './TradeNoInfo';

const nanoid = customAlphabet('1234567890', 32);

/**
 * 退款请求
 */
 export class TradeRefundRequest extends TradeNoInfo {

	constructor(idType: TradeId, id: string, totalFee: number, refundFee: number) {
		super(idType, id);
		this.refundNo = nanoid();
		this.totalFee = totalFee;
		this.refundFee = refundFee;
	}

    /**
	 * 标价金额 订单总金额，单位为分
	 */
	@Expose({ name: "total_fee" })
	totalFee!: number;

	/**
	 * 商户退款单号 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
	 */
	@Expose({ name: "out_refund_no" })
	readonly refundNo!: string;

	/**
	 * 退款金额 退款总金额，订单总金额，单位为分，只能为整数
	 */
	@Expose({ name: "refund_fee" })
	refundFee!: number;

	/**
	 * 符合ISO 4217标准的三位字母代码，默认人民币：CNY
	 */
	@Expose({ name: "refund_fee_type" })
	refundFeeType?: FeeTypeEnum;

	/**
	 * 退款资金来源 仅针对老资金流商户使用
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