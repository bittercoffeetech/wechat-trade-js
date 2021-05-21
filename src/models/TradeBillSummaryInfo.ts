import { Expose } from 'class-transformer';

import { CsvModel } from '../decorators/CsvModel';

/**
 * 交易概要信息
 */
 @CsvModel(['total_trades', 'settlement_total_fee', 'total_refunded_fee', 'total_coupon_fee',
 'total_service_fee', 'total_fee', 'total_refund_fee'])
 export class TradeBillSummaryInfo {
 
     /**
      * 总交易单数
      */
     @Expose({ name: "total_trades" })
     totalTrades!: number;
 
     /**
      * 应结订单总金额
      */
     @Expose({ name: "settlement_total_fee" })
     settlementTotalFee!: number;
 
     /**
      * 退款总金额
      */
     @Expose({ name: "total_refunded_fee" })
     totalRefundedFee!: number;
 
     /**
      * 充值券退款总金额
      */
     @Expose({ name: "total_coupon_fee" })
     totalCouponFee!: number;
 
     /**
      * 手续费总金额
      */
     @Expose({ name: "total_service_fee" })
     totalServiceFee!: number;
 
     /**
      * 订单总金额
      */
     @Expose({ name: "total_fee" })
     totalFee!: number;
 
     /**
      * 申请退款总金额
      */
     @Expose({ name: "total_refund_fee" })
     totalRefundFee!: number;
 
 }