import { Expose } from 'class-transformer';

import { CsvModel } from '../decorators/CsvModel';
import { RefundChannelEnum } from '../enums/RefundChannelEnum';
import { RefundStatusEnum } from '../enums/RefundStatusEnum';
import { TradeBillSuccessInfo } from './TradeBillSuccessInfo';

/**
 * 所有交易信息
 */
 @CsvModel(['trade_time', 'app_id', 'mch_id', 'sub_mch_id', 'device_info', 'transaction_id', 'trade_no',
 'open_id', 'trade_type', 'trade_status', 'bank_type', 'fee_type', 'settlement_total_fee', 'coupon_fee',
 'refund_id', 'refund_no', 'refunded_fee', 'refund_coupon_fee', 'refund_channel', 'refund_status', 'body',
 'attach', 'service_fee', 'rate', 'total_fee', 'refund_fee', 'rate_desc'])
 export class TradeBillAllInfo extends TradeBillSuccessInfo {
 
     /**
      * 微信退款单号
      */
     @Expose({ name: "refund_id" })
     refundId!: string;
 
     /**
      * 商户退款单号
      */
     @Expose({ name: "refund_no" })
     refundNo!: string;
 
     /**
      * 退款金额
      */
     @Expose({ name: "refunded_fee" })
     refundedFee!: number;
 
     /**
      * 充值券退款金额
      */
     @Expose({ name: "refund_coupon_fee" })
     refundCouponFee!: number;
 
     /**
      * 退款类型
      */
     @Expose({ name: "refund_channel" })
     refundChannel!: RefundChannelEnum;
 
     /**
      * 退款状态
      */
     @Expose({ name: "refund_status" })
     refundStatus!: RefundStatusEnum;
 
     /**
      * 申请退款金额
      */
     @Expose({ name: "refund_fee" })
     refundFee!: number;
 }