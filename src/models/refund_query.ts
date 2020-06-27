import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { RefundAccountEnum, RefundChannelEnum, RefundStatusEnum } from '../enums/refunds';
import { TradeCashFeeModel, TradeId, TradeNoModel, TradeRefundCouponInfo, XmlModel } from './base';

/**
 * 退款ID类型
 */
export type RefundId = TradeId | 'rno' | 'rid';

/**
 * 
 * @param id 商户退款所属商户单号
 */
export const RTNO = (id: string) : TradeRefundQueryModel => new TradeRefundQueryModel("tno", id);

/**
 * 
 * @param id 微信退款所属交易流水号
 */
export const RTID = (id: string) : TradeRefundQueryModel => new TradeRefundQueryModel("tid", id);

/**
 * 
 * @param id 商户退款单号
 */
export const RNO = (id: string) : TradeRefundQueryModel => new TradeRefundQueryModel("rno", id);

/**
 * 
 * @param id 微信退款交易号
 */
export const RID = (id: string) : TradeRefundQueryModel => new TradeRefundQueryModel("rid", id);

/**
 * 退款查询
 */
export class TradeRefundQueryModel extends TradeNoModel {

	constructor(idType: RefundId, id: string) {
		super(idType as TradeId, id)
		if(idType == 'rno') {
			this.refundNo = id;
		} else if (idType == 'rid') {
			this.refundId = id;
		}
	}

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

/**
 * 退款详情
 */
export class TradeRefundInfo {
	/**
	 * 商户退款单号 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
	 */
	@Expose({ name: "out_refund_no" })
	@XmlModel('out_refund_no')
	refundNo!: string;

	/**
	 * 微信退款单号 微信生成的退款单号，在申请退款接口有返回
	 */
	@Expose({ name: "refund_id" })
	@XmlModel('refund_id')
	refundId!: string;

	/**
	 * 退款金额 退款总金额，订单总金额，单位为分，只能为整数
	 */
	@Expose({ name: "refund_fee" })
	@XmlModel('refund_fee')
	refundFee!: number;

	/**
	 * 应结退款金额 去掉非充值代金券退款金额后的退款金额，退款金额=申请退款金额-非充值代金券退款金额，退款金额&lt;=申请退款金额
	 */
	@Expose({ name: "settlement_refund_fee" })
	@XmlModel('settlement_refund_fee')
	settlementRefundFee?: number;

	/**
	 * 退款状态
	 */
	@Expose({ name: "refund_status" })
	@XmlModel('refund_status')
	refundStatus!: RefundStatusEnum;

	/**
	 * 退款资金来源 仅针对老资金流商户使用
	 * 
	 * @see RefundAccountEnum
	 */
	@Expose({ name: "refund_account" })
	@XmlModel('refund_account')
	refundAccount?: RefundAccountEnum;

	/**
	 * 退款入账账户
	 */
	@Expose({ name: "refund_recv_accout" })
	@XmlModel('refund_recv_accout')
	refundRecvAccout?: string;

	/**
	 * 退款渠道
	 */
	@Expose({ name: "refund_channel" })
	@XmlModel('refund_channel')
	refundChannel!: RefundChannelEnum;

	/**
	 * 退款成功时间 资金退款至用户帐号的时间，格式2017-12-15 09:46:01
	 */
	@Expose({ name: "refund_success_time" })
	@XmlModel('refund_success_time')
	@Transform(value => (value != undefined) ? moment(value, 'YYYY-MM-DD hh:mm:ss') : undefined)
	successTime!: moment.Moment;

	/**
	 * 代金券使用数量
	 */
	@Expose({ name: "coupon_refund_count" })
	@XmlModel('coupon_refund_count')
	couponCount?: number;

	/**
	 * 代金券金额 “代金券”金额&lt;=订单金额，订单金额-“代金券”金额=现金支付金额
	 */
	@Expose({ name: "coupon_refund_fee" })
	@XmlModel('coupon_refund_fee')
	couponFee?: number;

	/**
	 * 代金券
	 * 
	 * @see TradeRefundCouponInfo
	 */
	@Expose({ name: "coupons" })
	@Type(() => TradeRefundCouponInfo)
	@XmlModel('coupons', TradeRefundCouponInfo, "coupon_refund_count")
	coupons?: TradeRefundCouponInfo[];
}

/**
 * 退款请求返回
 */
export class TradeRefundQueryResponseModel extends TradeCashFeeModel {
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