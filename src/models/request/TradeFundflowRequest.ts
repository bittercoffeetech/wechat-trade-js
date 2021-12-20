import { Expose } from 'class-transformer';

import { AccountTypeEnum } from '../../enums/AccountTypeEnum';
import { TradeDownloadRequest } from '../request/TradeDownloadRequest';

/**
 * 资金账单请求
 */
 export class TradeFundflowRequest extends TradeDownloadRequest {

	constructor(year: number, month: number, day: number, accountType: AccountTypeEnum, tar?: boolean) {
		super(year, month, day, tar);
		this.accountType = accountType;
	}

	/**
	 * 资金账户类型
	 */
    @Expose({ name: "account_type" })
    accountType!: AccountTypeEnum;
}