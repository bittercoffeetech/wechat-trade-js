import 'reflect-metadata';

import { Expose } from 'class-transformer';

/**
 * 区分商户流水号和微信交易编号的ID类型
 */
export type TradeId = 'tno' | 'tid';

/**
 * 
 * @param tradeNo 商户流水号
 */
export const TNO = (tradeNo: string) : TradeNo => new TradeNo('tno', tradeNo);

/**
 * 
 * @param transId 微信交易号
 */
export const TID = (transId: string) : TradeNo => new TradeNo('tid', transId);

/**
 * 交易标识
 */
export class TradeNo {

	constructor(idType: TradeId, id: string) {
		if(idType == 'tno') {
			this.tradeNo = id;
		} else {
			this.transactionId = id;
		}
	}

	/**
	 * <p>商户订单号 商户系统内部订单号，要求32个字符内，只能是数字、大小写字母_-|*@ ，且在同一个商户号下唯一。</p>
	 */
	@Expose({ name: "out_trade_no" })
	tradeNo?: string;

	/**
	 * 微信订单号 微信的订单号，优先使用
	 */
	@Expose({ name: "transaction_id" })
	transactionId?: string;
}