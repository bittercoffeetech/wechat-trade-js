import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';

import { XmlProperty } from '../decorators/XmlProperty';
import { TradeTypeEnum } from '../enums/TradeTypeEnum';
import { TradeCashFeeInfo } from './TradeCashFeeInfo';
import { TradeCouponInfo } from './TradeCouponInfo';

/**
 * 付款结果通知
 */
 export class TradeCreateNotify extends TradeCashFeeInfo {

	/**
	 * 用户标识 tradeType=TradeTypeEnum.JSAPI，此参数必传，用户在商户appid下的唯一标识。
	 */
	@Expose({ name: "openid" })
	openId!: string;;

	/**
	 * 交易类型
	 * 
	 * @see TradeTypeEnum
	 */
	@Expose({ name: "trade_type" })
	tradeType?: TradeTypeEnum;

	/**
	 * 附加数据 附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用
	 */
	@Expose({ name: "attach" })
	attach?: string;;

	/**
	 * 付款银行 银行类型，采用字符串类型的银行标识
	 */
	@Expose({ name: "bank_type" })
	bankType!: string;

	/**
	 * 是否关注公众账号 用户是否关注公众账号，Y-关注，N-未关注
	 */
	@Expose({ name: "is_subscribe" })
	isSubscribe!: boolean;

	/**
	 * 支付完成时间 订单支付时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010。
	 */
	@Expose({ name: "time_end" })
	@Transform(({ value }) => value || moment(value, 'YYYYMMDDhhmmss'), { toClassOnly: true })
	timeEnd?: moment.Moment;

	/**
	 * 代金券使用数量
	 */
	@Expose({ name: "coupon_count" })
	couponCount?: number;

	/**
	 * 代金券金额 “代金券”金额&lt;=订单金额，订单金额-“代金券”金额=现金支付金额
	 */
	@Expose({ name: "coupon_fee" })
	couponFee?: number;

	/**
	 * 代金券
	 * 
	 * @see TradeCouponInfo
	 */
	@Expose({ name: "coupons" })
	@Type(() => TradeCouponInfo)
	@XmlProperty('coupons', TradeCouponInfo, "coupon_count")
	coupons?: TradeCouponInfo[];
}