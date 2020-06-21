import { Expose } from 'class-transformer';
import 'reflect-metadata';

import { CouponTypeEnum } from '../enums/CouponTypeEnum';
import { FeeTypeEnum } from '../enums/FeeTypeEnum';
import { ResultStatusEnum } from '../enums/ResultStatusEnum';
import { SignTypeEnum } from '../enums/SignTypeEnum';

/**
 * Xml级联标签定义
 */
export interface XmlModel {
    name: string;
    subType: new(...args: any[]) => any;
    subName: string;
    countName: string
}

/**
 * Xml级联标签注解
 * 
 * @param name 当前属性名
 * @param subType 对应集合中的子类型
 * @param countName 表示数量的字段名
 */
export function XmlModel(name: string, subType?: new(...args: any[]) => any, countName?: string): PropertyDecorator {
    return (target, propertyName) => {
        Reflect.defineMetadata(propertyName.toString(), 
            {name: name, subType: subType, countName: countName}, 
            target.constructor); 
    }
};

/**
 * 定义CSV返回结果的列信息
 * 
 * @param columns 列属性id数组
 */
export function CsvModel(columns: string[]): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata("columns", 
            columns, 
            target); 
    }
};

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
	signType?: SignTypeEnum;

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

export const ERRORS = {
	'SYSTEMERROR' : "系统错误",
	'XML_FORMAT_ERROR' : "XML格式错误",
	'APPID_NOT_EXIST' : "APPID不存在",
	'MCHID_NOT_EXIST' : "MCHID不存在",
	'APPID_MCHID_NOT_MATCH' : "appid和mch_id不匹配",
	'SIGNERROR' : "签名错误",
	'REQUIRE_POST_METHOD' : "请使用post方法",
	'NOAUTH' : "商户无此接口权限",
	'INVALID_REQUEST' : "参数错误",
	'LACK_PARAMS' : "缺少参数",
	'POST_DATA_EMPTY' : "post数据为空",
	'NOT_UTF8' : "编码格式错误",
	'NOTENOUGH' : "余额不足",
	'ORDERPAID' : "商户订单已支付",
	'ORDERCLOSED' : "订单已关闭",
	'OUT_TRADE_NO_USED' : "商户订单号重复",
	'PARAM_ERROR' : "参数错误",
	'INVALID_REQ_TOO_MUCH' : "无效请求过多",
	'FREQUENCY_LIMITED' : "频率限制",
	'CERT_ERROR' : "证书校验错误",
	'INVALID_TRANSACTIONID' : "无效transaction_id",
	'BIZERR_NEED_RETRY' : "退款业务流程错误，需要商户触发重试来解决",
	'TRADE_OVERDUE' : "订单已经超过退款期限",
	'ERROR' : "业务错误",
	'USER_ACCOUNT_ABNORMAL' : "退款请求失败",
	'REFUND_FEE_MISMATCH' : "订单金额或退款金额与之前请求不一致，请核实后再试",
	'ORDER_NOT_READY' : "订单处理中，暂时无法退款，请稍后再试",
	'REFUNDNOTEXIST' : "退款订单查询失败"
};