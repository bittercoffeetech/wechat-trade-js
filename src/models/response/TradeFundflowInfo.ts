import { Expose } from 'class-transformer';
import { Moment } from 'moment';

import { CsvColumns } from '../../decorators/CsvColumns';

/**
 * 资金账单详情
 */
 @CsvColumns(['account_time', 'transaction_id', 'trade_no', 'biz_name', 'biz_type', 'trade_type', 'fee',
 'balance', 'proposer', 'note', 'voucher_no'])
 export class TradeFundflowInfo {
 
     /**
      * 记账时间
      */
     @Expose({ name: "account_time" })
     accountTime!: Moment;
 
     /**
      * 微信支付业务单号
      */
     @Expose({ name: "transaction_id" })
     transactionId!: string;
 
     /**
      * 资金流水单号
      */
     @Expose({ name: "trade_no" })
     tradeNo!: string;
 
     /**
      * 业务名称
      */
     @Expose({ name: "biz_name" })
     bizName!: string;
 
     /**
      * 业务类型
      */
     @Expose({ name: "biz_type" })
     bizType!: string;
 
     /**
      * 收支类型
      */
     @Expose({ name: "trade_type" })
     tradeType!: string;
 
     /**
      * 收支金额（元）
      */
     @Expose({ name: "fee" })
     fee!: number;
 
     /**
      * 账户结余（元）
      */
     @Expose({ name: "balance" })
     balance!: number;
 
     /**
      * 资金变更提交申请人
      */
     @Expose({ name: "proposer" })
     proposer!: string;
 
     /**
      * 备注
      */
     @Expose({ name: "note" })
     note?: string;
 
     /**
      * 业务凭证号
      */
     @Expose({ name: "voucher_no" })
     voucherNo!: string;
 }