import { Expose } from "class-transformer";
import { FeeTypeEnum } from "../enums/FeeTypeEnum";
import { CouponTypeEnum } from "../enums/CouponTypeEnum";
import { ApiField } from "../decorators";

export class TradeNoModel {
    /**
	 * <p>商户订单号 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。</p>
	 */
	@Expose({ name: "out_trade_no" })
	tradeNo!: string;

	/**
	 * 微信订单号 微信的订单号，优先使用
	 */
	@Expose({ name: "transaction_id" })
	transactionId!: string;
}

export class TradeFeeModel extends TradeNoModel {
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

export class TradeCashFeeModel extends TradeFeeModel {
	/**
	 * 符合ISO 4217标准的三位字母代码，默认人民币：CNY
	 */
	@Expose({ name: "fee_type" })
	feeType?: FeeTypeEnum;

	/**
	 * 现金支付金额 现金支付金额订单现金支付金额
	 */
	@Expose({ name: "cash_fee" })
	cashFee!: number;

	/**
	 * 现金支付币种 货币类型，符合ISO 4217标准的三位字母代码，默认人民币：CNY
	 */
	@Expose({ name: "cash_fee_type" })
	cashFeeType?: FeeTypeEnum;

}

export class TradeCouponInfo {

	/**
	 * 代金券ID
	 */
	@Expose({name : "coupon_id"})
	@ApiField('coupon_id')
	id!: string;

	/**
	 * 单个代金券支付金额
	 */
	@Expose({name : "coupon_fee"})
	@ApiField('coupon_fee')
	fee!: number;

	/**
	 * 代金券类型 开通免充值券功能，并且订单使用了优惠券后有返回（取值：CASH、NO_CASH）。
	 * 
	 * @see CouponTypeEnum
	 */
	@Expose({name : "coupon_type"})
	@ApiField('coupon_type')
    type!: CouponTypeEnum;
    
}

export class TradeRefundCouponInfo {

	/**
	 * 代金券ID
	 */
	@Expose({name : "coupon_refund_id"})
	@ApiField('coupon_refund_id')
	id!: string;

	/**
	 * 单个代金券支付金额
	 */
	@Expose({name : "coupon_refund_fee"})
	@ApiField('coupon_refund_fee')
	fee!: number;

	/**
	 * 代金券类型 开通免充值券功能，并且订单使用了优惠券后有返回（取值：CASH、NO_CASH）。
	 * 
	 * @see CouponTypeEnum
	 */
	@Expose({name : "coupon_type"})
	@ApiField('coupon_type')
    type!: CouponTypeEnum;
    
}