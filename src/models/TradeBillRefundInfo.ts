import { Expose, Transform } from 'class-transformer';
import moment, { Moment } from 'moment';

import { CsvColumns } from '../decorators/CsvColumns';
import { TradeBillAllInfo } from './TradeBillAllInfo';

/**
 * 退款交易信息
 */
 @CsvColumns(['trade_time', 'app_id', 'mch_id', 'sub_mch_id', 'device_info', 'transaction_id', 'trade_no', 'open_id', 'trade_type',
 'trade_status', 'bank_type', 'fee_type', 'settlement_total_fee', 'coupon_fee', 'refund_time', 'refund_success_time', 'refund_id',
 'refund_no', 'refunded_fee', 'refund_coupon_fee', 'refund_channel', 'refund_status', 'body', 'attach', 'service_fee', 'rate',
 'total_fee', 'refund_fee', 'rate_desc'])
 export class TradeBillRefundInfo extends TradeBillAllInfo {
 
     /**
      * 退款申请时间
      */
     @Expose({ name: "refund_time" })
     @Transform(({ value }) => moment(value, 'YYYY-MM-DD hh:mm:ss'), { toClassOnly: true })
     refundTime!: Moment;	
 
     /**
      * 退款成功时间
      */
     @Expose({ name: "refund_success_time" })
     @Transform(({ value }) => moment(value, 'YYYY-MM-DD hh:mm:ss'), { toClassOnly: true })
     refundSuccessTime!: Moment;
 }