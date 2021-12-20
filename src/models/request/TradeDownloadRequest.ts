import { Expose, Transform } from 'class-transformer';
import moment, { Moment } from 'moment';

/**
 * 账单请求
 */
 export abstract class TradeDownloadRequest {

	constructor(year: number, month: number, day: number, tar?: boolean) {
		this.billDate = moment([year, month - 1, day]);
		this.tarType = tar;
	}

	/**
	 * 下载对账单的日期，格式：20140603
	 */
	@Expose({ name: "bill_date" })
	@Transform(({ value }) => value.utcOffset('+08:00').format('YYYYMMDD'), { toPlainOnly: true})
    billDate!: Moment;	

	/**
	 * 压缩账单
	 */
    @Expose({ name: "tar_type" })
    @Transform(({ value }) => (value as boolean) ? 'GZIP' : undefined, { toPlainOnly: true})
    tarType?: boolean = false;	
}