import { Expose } from 'class-transformer';

import { BillTypeEnum } from '../enums/BillTypeEnum';
import { TradeDownloadRequest } from './TradeDownloadRequest';

/**
 * 下载所有交易
 */
 export class TradeBillAllRequest extends TradeDownloadRequest {

	/**
	 * 账单类型
	 */
    @Expose({ name: "bill_type" })
    readonly billType: BillTypeEnum = BillTypeEnum.ALL;
}