import { Expose, Transform, Type } from "class-transformer";
import { FeeTypeEnum } from "../enums/FeeTypeEnum";
import { TradeTypeEnum } from "../enums/TradeTypeEnum";
import moment from "moment";
import { TradeAppModel } from './TradeCommons';
import { TradeCashFeeModel, TradeCouponInfo } from './TradeCommonResponse';
import "reflect-metadata";
import { ApiField } from "../decorators";

export class TradeGoodInfo {
    /**
     * 商品编码 由半角的大小写字母、数字、中划线、下划线中的一种或几种组成
     */
	@Expose({ name: "goods_id" })
	goodsId!: string;

    /**
     * 微信侧商品编码 微信支付定义的统一商品编号（没有可不传）
     */
	@Expose({ name: "wxpay_goods_id" })
	payGoodsId!: string;

    /**
     * 商品名称 商品的实际名称
     */
	@Expose({ name: "goods_name" })
	goodsName!: string;

    /**
     * 商品数量 用户购买的数量
     */
	@Expose({ name: "quantity" })
	quantity!: number;

    /**
     * 商品单价
     * 单位为：分。如果商户有优惠，需传输商户优惠后的单价(例如：用户对一笔100元的订单使用了商场发的纸质优惠券100-50，则活动商品的单价应为原单价-50)
     */
	@Expose({ name: "price" })
	price!: number;
}

export class TradeGoodsDetailInfo {
    /**
	 * 订单原价
	 * 
	 * <ul>
	 * <li>1.商户侧一张小票订单可能被分多次支付，订单原价用于记录整张小票的交易金额。</li>
	 * <li>2.当订单原价与支付金额不相等，则不享受优惠。</li>
	 * <li>3.该字段主要用于防止同一张小票分多次支付，以享受多次优惠的情况，正常支付订单不必上传此参数。</li>
	 * </ul>
	 */
	@Expose({ name: "cost_price" })
	costPrice!: number;

	/**
	 * 商品小票ID
	 */
	@Expose({ name: "receipt_id" })
	receiptId!: string;

	/**
	 * 单品列表 单品信息，使用Json数组格式提交
	 * 
	 * @see GoodInfo
	 */
	@Expose({ name: "goods_detail" })
	@Type(() => TradeGoodInfo)
	goods?: TradeGoodInfo[];
}

export class TradeSceneInfo {

	/**
	 * 门店id 门店编号，由商户自定义
	 */
	id!: string;

	/**
	 * 门店名称 门店名称 ，由商户自定义
	 */
	name!: string;

	/**
	 * 门店行政区划码 门店所在地行政区划码
	 */
	@Expose({ name: "area_code" })
	areaCode!: string;

	/**
	 * 门店详细地址 门店详细地址 ，由商户自定义
	 */
	address?: string;
}

export class TradeCreateModel {

	constructor(tradeType: TradeTypeEnum, totalFee: number, body: string) {
		this.tradeType = tradeType;
		this.totalFee = totalFee;
		this.body = body;
	}

	/**
	 * 商户订单号 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*且在同一个商户号下唯一。
	 */
	@Expose({ name: "out_trade_no" })
	tradeNo!: string;

	/**
	 * 符合ISO 4217标准的三位字母代码，默认人民币：CNY
	 */
	@Expose({ name: "fee_type" })
	feeType?: FeeTypeEnum = FeeTypeEnum.CNY;

	/**
	 * 标价金额 订单总金额，单位为分
	 */
	@Expose({ name: "total_fee" })
	totalFee!: number;

	/**
	 * 设备号 自定义参数，可以为请求支付的终端设备号等
	 */
	@Expose({ name: "device_info" })
	deviceInfo?: string;

	/**
	 * 商品描述 商品简单描述
	 */
	@Expose({ name: "body" })
	body!: string;

	/**
	 * 附加数据 附加数据，在查询API和支付通知中原样返回，可作为自定义参数使用
	 */
	@Expose({ name: "attach" })
	attach?: string;

	/**
	 * 终端IP 支持IPV4和IPV6两种格式的IP地址。调用微信支付API的机器IP
	 */
	@Expose({ name: "spbill_create_ip" })
	spbillCreateIp!: string;

	/**
	 * 交易起始时间 订单生成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010
	 */
	@Expose({ name: "time_start" })
	@Transform(value => (value != undefined) ? moment(value).utcOffset('+08:00').format('YYYYMMDDhhmmss') : undefined)
	timeStart?: moment.Moment;

	/**
	 * 交易结束时间
	 * 订单失效时间，格式为yyyyMMddHHmmss，如2009年12月27日9点10分10秒表示为20091227091010。订单失效时间是针对订单号而言的，由于在请求支付的时候有一个必传参数prepay_id只有两小时的有效期，所以在重入时间超过2小时的时候需要重新请求下单接口获取新的prepay_id。
	 */
	@Expose({ name: "time_expire" })
	@Transform(value => (value != undefined) ? moment(value).utcOffset('+08:00').format('YYYYMMDDhhmmss') : undefined)
	timeExpire?: moment.Moment;

	// /**
	//  * 订单优惠标记 订单优惠标记，使用代金券或立减优惠功能时需要的参数
	//  */
	@Expose({ name: "goods_tag" })
	goodsTag?: string;

	/**
	 * 通知地址 异步接收微信支付结果通知的回调地址，通知url必须为外网可访问的url，不能携带参数。
	 */
	@Expose({ name: "notify_url" })
	notifyUrl!: string;

	/**
	 * 交易类型
	 * 
	 * @see TradeTypeEnum
	 */
	@Expose({ name: "trade_type" })
	tradeType: TradeTypeEnum = TradeTypeEnum.JSAPI;

	/**
	 * 商品ID tradeType=TradeTypeEnum.NATIVE时，此参数必传。此参数为二维码中包含的商品ID，商户自行定义。
	 */
	@Expose({ name: "product_id" })
	productId?: string;

	/**
	 * 指定支付方式 上传此参数no_credit--可限制用户不能使用信用卡支付
	 */
	@Expose({ name: "limit_pay" })
	limitPay?: string;

	/**
	 * 用户标识 tradeType=TradeTypeEnum.JSAPI，此参数必传，用户在商户appid下的唯一标识。
	 */
	@Expose({ name: "openid" })
	openId!: string;

	/**
	 * 电子发票入口开放标识 Y，传入Y时，支付成功消息和支付详情页将出现开票入口。需要在微信支付商户平台或微信公众平台开通电子发票功能，传此字段才可生效
	 */
	@Expose({ name: "receipt" })
	@Transform(value => (value as boolean) ? 'Y' : 'N')
	receipt?: boolean;

	/**
	 * 场景信息 该字段常用于线下活动时的场景信息上报，支持上报实际门店信息，商户也可以按需求自己上报相关信息。该字段为JSON对象数据，对象格式为:
	 * <p>
	 * {"store_info":{"id": "门店ID","name": "名称","area_code": "编码","address": "地址" }}
	 * </p>
	 * 
	 * @see TradeSceneInfo
	 */
	@Expose({ name: "scene_info" })
	@Transform(value => JSON.stringify({ "scene_info": value }))
	sceneInfo?: TradeSceneInfo;

	/**
	 * 商品详情 商品详细描述，对于使用单品优惠的商户
	 * 
	 * @see TradeGoodsDetailInfo
	 */
	@Expose({ name: "detail" })
	@Transform(value => JSON.stringify(value))
	detail?: TradeGoodsDetailInfo;
}

export class TradeCreateResponseModel extends TradeAppModel {
	/**
	 * 二维码链接
	 */
	@Expose({ name: "code_url" })
	codeUrl!: string;

	/**
	 * 交易类型
	 * 
	 * @see TradeTypeEnum
	 */
	@Expose({ name: "trade_type" })
	tradeType!: TradeTypeEnum;

	/**
	 * 预支付交易会话标识
	 */
	@Expose({ name: "prepay_id" })
	prepayId!: string;

	/**
	 * 设备号 自定义参数，可以为请求支付的终端设备号等
	 */
	@Expose({ name: "device_info" })
	deviceInfo?: string;
}

export class TradeCreateNotifyModel extends TradeCashFeeModel {

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
	timeEnd?: Date;

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
	@ApiField('coupons', TradeCouponInfo, "coupon_count")
	coupons?: TradeCouponInfo[];
}