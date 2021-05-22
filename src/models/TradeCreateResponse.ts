import { Expose } from 'class-transformer';
import { customAlphabet } from 'nanoid';

import { TradeTypeEnum } from '../enums/TradeTypeEnum';
import { TradeAppInfo } from './TradeAppInfo';

const nanoid = customAlphabet('1234567890', 32);

/**
 * 统一下单返回
 */
 export class TradeCreateResponse extends TradeAppInfo {

	constructor() {
		super();
		this.tradeNo = nanoid();
	}

	/**
	 * 商户订单号 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*且在同一个商户号下唯一。
	 */
	 @Expose({ name: "out_trade_no" })
	 tradeNo!: string;

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