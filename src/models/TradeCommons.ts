import { Expose } from 'class-transformer';

import { XmlModel } from '../decorators';
import { CouponTypeEnum } from '../enums/CouponTypeEnum';
import { FeeTypeEnum } from '../enums/FeeTypeEnum';
import { ResultStatusEnum } from '../enums/ResultStatusEnum';
import { SignTypeEnum } from '../enums/SignTypeEnum';

/**
 * 应用标识
 */
export class TradeAppModel {

    /**
     * 应用标识
     */
	@Expose({ name: 'appid' })
	appId!: string;

    /**
     * 商户标识
     */
	@Expose({ name: 'mch_id' })
	mchId!: string;
}

/**
 * 签名信息
 */
export class TradeSignatureModel extends TradeAppModel {

    /**
     * 干扰字符串
     */
	@Expose({ name: 'nonce_str' })
	nonceStr!: string;

	/**
	 * 签名算法
	 */
	@Expose({ name: 'sign_type' })
	signType: SignTypeEnum = SignTypeEnum.MD5;

	/**
	 * 签名
	 */
	@Expose({ name: 'sign' })
	sign!: string;
}

/**
 * 返回信息
 */
export class TradeReturnModel {

	/**
	 * 返回状态码 SUCCESS/FAIL 此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断
	 */
	@Expose({ name: 'return_code' })
	returnCode!: ResultStatusEnum;

	/**
	 * 返回信息，如非空，未知错误原因,签名失败,参数格式校验错误
	 */
	@Expose({ name: 'return_msg' })
	returnMessage?: string;

	get isSuccess(): boolean {
		return ResultStatusEnum.SUCCESS == this.returnCode;
	}
}

/**
 * 错误返回
 */
export class TradeErrorReturnModel extends TradeReturnModel {

    /**
     * 错误代码
     */
	@Expose({ name: 'error_code' })
	errorCode?: string;
}

/**
 * 业务结果
 */
export class TradeResultModel {
	/**
	 * 返回状态码 SUCCESS/FAIL
	 */
	@Expose({ name: "result_code" })
	resultCode!: ResultStatusEnum;

	/**
	 * 错误代码
	 */
	@Expose({ name: "err_code" })
	errorCode!: string;

	/**
	 * 错误代码描述
	 */
	@Expose({ name: "err_code_des" })
	errorMessage?: string;

	get isSuccess(): boolean {
		return ResultStatusEnum.SUCCESS == this.resultCode;
	}
}

/**
 * 交易标识
 */
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

/**
 * 金额相关
 */
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

/**
 * 现金信息
 */
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

/**
 * 优惠券
 */
export class TradeCouponInfo {

	/**
	 * 代金券ID
	 */
	@Expose({ name: "coupon_id" })
	@XmlModel('coupon_id')
	id!: string;

	/**
	 * 单个代金券支付金额
	 */
	@Expose({ name: "coupon_fee" })
	@XmlModel('coupon_fee')
	fee!: number;

	/**
	 * 代金券类型 开通免充值券功能，并且订单使用了优惠券后有返回（取值：CASH、NO_CASH）。
	 * 
	 * @see CouponTypeEnum
	 */
	@Expose({ name: "coupon_type" })
	@XmlModel('coupon_type')
	type!: CouponTypeEnum;

}

/**
 * 退款优惠券
 */
export class TradeRefundCouponInfo {

	/**
	 * 代金券ID
	 */
	@Expose({ name: "coupon_refund_id" })
	@XmlModel('coupon_refund_id')
	id!: string;

	/**
	 * 单个代金券支付金额
	 */
	@Expose({ name: "coupon_refund_fee" })
	@XmlModel('coupon_refund_fee')
	fee!: number;

	/**
	 * 代金券类型 开通免充值券功能，并且订单使用了优惠券后有返回（取值：CASH、NO_CASH）。
	 * 
	 * @see CouponTypeEnum
	 */
	@Expose({ name: "coupon_type" })
	@XmlModel('coupon_type')
	type!: CouponTypeEnum;

}