import { Expose } from 'class-transformer';

import { TradeStatusEnum } from '../../enums/TradeStatusEnum';
import { TradeCreateNotify } from './TradeCreateNotify';

/**
 * 查询结果返回
 */
export class TradeQueryResponse extends TradeCreateNotify {
	/**
	 * 设备号 自定义参数，可以为请求支付的终端设备号等
	 */
	@Expose({ name: "device_info" })
	deviceInfo?: string;

	/**
	 * 交易状态
	 * 
	 * @see TradeStatusEnum
	 */
	@Expose({ name: "trade_state" })
	tradeState!: TradeStatusEnum;

	/**
	 * 交易状态描述 对当前查询订单状态的描述和下一步操作的指引
	 */
	@Expose({ name: "trade_state_desc" })
	tradeStateDesc?: string;

}