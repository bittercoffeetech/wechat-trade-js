import { Expose } from 'class-transformer';

import { BillTypeEnum } from '../../enums/BillTypeEnum';
import { TradeDownloadRequest } from './TradeDownloadRequest';

/**
 * 下载付款成功交易
 */
 export class TradeBillSuccessRequest extends TradeDownloadRequest {

	/**
	 * 账单类型
	 */
    @Expose({ name: "bill_type" })
    readonly billType: BillTypeEnum = BillTypeEnum.SUCCESS;
}