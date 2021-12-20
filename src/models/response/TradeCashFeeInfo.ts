import { Expose } from 'class-transformer';

import { FeeTypeEnum } from '../../enums/FeeTypeEnum';
import { TradeFeeInfo } from './TradeFeeInfo';

/**
 * 现金信息
 */
 export class TradeCashFeeInfo extends TradeFeeInfo {
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