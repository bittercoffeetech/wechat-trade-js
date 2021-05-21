/**
 * 退款账号
 * 
 * @author BitterCoffee
 *
 */
 export enum RefundAccountEnum {
	/**
	 * 未结算资金退款（默认使用未结算资金退款）
	 */
	REFUND_SOURCE_RECHARGE_FUNDS = "REFUND_SOURCE_RECHARGE_FUNDS", 
	/**
	 * 可用余额退款
	 */
	REFUND_SOURCE_UNSETTLED_FUNDS = "REFUND_SOURCE_UNSETTLED_FUNDS"
};