import { Expose, Transform } from 'class-transformer';
import moment from 'moment';

import { FeeTypeEnum } from '../enums/FeeTypeEnum';
import { TradeTypeEnum } from '../enums/TradeTypeEnum';
import { TradeGoodsDetailInfo } from './TradeGoodsDetailInfo';
import { TradeSceneInfo } from './TradeSceneInfo';

/**
 * 统一下单
 */
 export class TradeCreateRequest {

	constructor(tradeType: TradeTypeEnum, totalFee: number, body: string) {
		this.tradeType = tradeType;
		this.totalFee = totalFee;
		this.body = body;
	}
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
	@Transform(({ value }) => value || moment(value).utcOffset('+08:00').format('YYYYMMDDhhmmss'), { toPlainOnly: true })
	timeStart?: moment.Moment;

	/**
	 * 交易结束时间
	 * 订单失效时间，格式为yyyyMMddHHmmss，如2009年12月27日9点10分10秒表示为20091227091010。订单失效时间是针对订单号而言的，由于在请求支付的时候有一个必传参数prepay_id只有两小时的有效期，所以在重入时间超过2小时的时候需要重新请求下单接口获取新的prepay_id。
	 */
	@Expose({ name: "time_expire" })
	@Transform(({ value }) => value || moment(value).utcOffset('+08:00').format('YYYYMMDDhhmmss'), { toPlainOnly: true })
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
	readonly tradeType: TradeTypeEnum = TradeTypeEnum.JSAPI;

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
	@Transform(({ value }) => (value as boolean) ? 'Y' : 'N', { toPlainOnly: true })
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
	@Transform(value => JSON.stringify({ "scene_info": value }), { toPlainOnly: true })
	sceneInfo?: TradeSceneInfo;

	/**
	 * 商品详情 商品详细描述，对于使用单品优惠的商户
	 * 
	 * @see TradeGoodsDetailInfo
	 */
	@Expose({ name: "detail" })
	@Transform(value => JSON.stringify(value), { toPlainOnly: true })
	detail?: TradeGoodsDetailInfo;
}