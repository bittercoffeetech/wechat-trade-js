import { Expose, Transform } from "class-transformer";
import { Moment } from "moment";
import { TradeTypeEnum } from "../enums/TradeTypeEnum";
import { TradeStatusEnum } from "../enums/TradeStatusEnum";
import { FeeTypeEnum } from "../enums/FeeTypeEnum";
import { RefundChannelEnum } from "../enums/RefundChannelEnum";
import { RefundStatusEnum } from "../enums/RefundStatusEnum";
import moment from "moment";

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

export class TradeBillSuccessInfo {

	/**
	 * 交易时间
	 */
	@Expose({ name: "trade_time" })
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

export class TradeBillRefundInfo extends TradeBillAllInfo {

	/**
	 * 退款申请时间
	 */
	@Expose({ name: "refund_time" })
	@Transform(value =>  moment(value, 'YYYY-MM-DD hh:mm:ss'))
	refundTime!: Moment;

	/**
	 * 退款成功时间
	 */
	@Expose({ name: "refund_success_time" })
	@Transform(value => moment(value, 'YYYY-MM-DD hh:mm:ss'))
	refundSuccessTime!: Moment;
}


export class TradeFundflowSummaryInfo {

	/**
	 * 资金流水总笔数
	 */
	@Expose({ name: "total_flows"})
	totalFlows!:number;

	/**
	 * 收入笔数
	 */
	@Expose({ name: "total_incomes"})
	totalIncomes!:number;

	/**
	 * 收入金额
	 */
	@Expose({ name: "total_income_fee"})
	totalIncomeFee!:number;

	/**
	 * 支出笔数
	 */
	@Expose({ name: "total_expenses"})
	totalExpenses!:number;

	/**
	 * 支出金额
	 */
	@Expose({ name: "total_expenses_fee"})
	totalExpensesFee!:number;
}

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

export class TradeBillAllResponseModel {
	summary!: TradeBillSummaryInfo;
	records!: TradeBillAllInfo[];
}

export class TradeBillSuccessResponseModel {
	summary!: TradeBillSummaryInfo;
	records!: TradeBillSuccessInfo[];
}

export class TradeBillRefundResponseModel {
	summary!: TradeBillSummaryInfo;
	records!: TradeBillRefundInfo[];
}

export class TradeFundflowResponseModel {
	summary!: TradeFundflowSummaryInfo;
	records!: TradeFundflowInfo[];
}