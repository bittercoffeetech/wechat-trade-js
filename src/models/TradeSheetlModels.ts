import { Expose, Transform } from "class-transformer";
import { BillTypeEnum } from "../enums/BillTypeEnum";
import { AccountTypeEnum } from "../enums/AccountTypeEnum";
import moment, { Moment } from 'moment';

export class TradeCsvlModel {

	/**
	 * 下载对账单的日期，格式：20140603
	 */
	@Expose({ name: "bill_date" })
	@Transform(value => (value != undefined) ? moment(value).utcOffset('+08:00').format('YYYYMMDD') : undefined)
    billDate!: Moment;

	/**
	 * 压缩账单
	 */
    @Expose({ name: "tar_type" })
    @Transform(value => (value as boolean) ? 'GZIP' : undefined)
    tarType?: boolean = false;
}

export class TradeBillAllModel extends TradeCsvlModel {

	/**
	 * 账单类型
	 */
    @Expose({ name: "bill_type" })
    billType: BillTypeEnum = BillTypeEnum.ALL;
}

export class TradeBillSuccessModel extends TradeCsvlModel {

	/**
	 * 账单类型
	 */
    @Expose({ name: "bill_type" })
    billType: BillTypeEnum = BillTypeEnum.SUCCESS;
}

export class TradeBillRefundModel extends TradeCsvlModel {

	/**
	 * 账单类型
	 */
    @Expose({ name: "bill_type" })
    billType: BillTypeEnum = BillTypeEnum.REFUND;
}

export class TradeFundflowModel extends TradeCsvlModel {

	/**
	 * 资金账户类型
	 */
    @Expose({ name: "account_type" })
    accountType!: AccountTypeEnum;
}