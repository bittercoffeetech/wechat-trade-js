import { Expose, Transform } from 'class-transformer';
import moment, { Moment } from 'moment';

import { CsvModel } from '../decorators/CsvModel';
import { FeeTypeEnum } from '../enums/FeeTypeEnum';
import { TradeStatusEnum } from '../enums/TradeStatusEnum';
import { TradeTypeEnum } from '../enums/TradeTypeEnum';

/**
 * 成功交易信息
 */
 @CsvModel(['trade_time', 'app_id', 'mch_id', 'sub_mch_id', 'device_info', 'transaction_id', 'trade_no',
 'open_id', 'trade_type', 'trade_status', 'bank_type', 'fee_type', 'settlement_total_fee', 'coupon_fee', 'body',
 'attach', 'service_fee', 'rate', 'total_fee', 'rate_desc'])
 export class TradeBillSuccessInfo {
 
     /**
      * 交易时间
      */
     @Expose({ name: "trade_time" })
     @Transform(({ value }) => moment(value, 'YYYY-MM-DD hh:mm:ss'), { toClassOnly: true })
     tradeTime!: Moment;	
 
     /**
      * 公众账号ID
      */
     @Expose({ name: "app_id" })
     appId!: string;
 
     /**
      * 商户号
      */
     @Expose({ name: "mch_id" })
     mchId!: string;
 
     /**
      * 特约商户号
      */
     @Expose({ name: "sub_mch_id" })
     subMchId!: string;
 
     /**
      * 设备号
      */
     @Expose({ name: "device_info" })
     deviceInfo!: string;
 
     /**
      * 微信订单号
      */
     @Expose({ name: "transaction_id" })
     transactionId!: string;
 
     /**
      * 商户订单号
      */
     @Expose({ name: "trade_no" })
     tradeNo!: string;
 
     /**
      * 用户标识
      */
     @Expose({ name: "open_id" })
     openId!: string;
 
     /**
      * 交易类型
      */
     @Expose({ name: "trade_type" })
     tradeType?: TradeTypeEnum;
 
     /**
      * 交易状态
      */
     @Expose({ name: "trade_status" })
     tradeStatus!: TradeStatusEnum;
 
     /**
      * 付款银行
      */
     @Expose({ name: "bank_type" })
     bankType?: string;
 
     /**
      * 货币种类
      */
     @Expose({ name: "fee_type" })
     feeType?: FeeTypeEnum;
 
     /**
      * 应结订单金额
      */
     @Expose({ name: "settlement_total_fee" })
     settlementTotalFee!: number;
 
     /**
      * 代金券金额
      */
     @Expose({ name: "coupon_fee" })
     couponFee?: string;
 
     /**
      * 商品名称
      */
     @Expose({ name: "body" })
     body!: string;
 
     /**
      * 商户数据包
      */
     @Expose({ name: "attach" })
     attach?: string;
 
     /**
      * 手续费
      */
     @Expose({ name: "service_fee" })
     serviceFee!: number;
 
     /**
      * 费率
      */
     @Expose({ name: "rate" })
     rate!: number;
 
     /**
      * 订单金额
      */
     @Expose({ name: "total_fee" })
     totalFee!: number;
 
     /**
      * 费率备注
      */
     @Expose({ name: "rate_desc" })
     rateDesc?: string;
 }