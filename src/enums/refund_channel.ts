/**
 * 退款渠道
 * 
 * @author BitterCoffee
 *
 */
export enum RefundChannelEnum {
	/**
	 * 原路退款
	 */
	ORIGINAL = "ORIGINAL", 
	/**
	 * 退回到余额
	 */
	BALANCE = "BALANCE",
	/**
	 * 原账户异常退到其他余额账户
	 */
	OTHER_BALANCE = "OTHER_BALANCE",
	/**
	 * 原银行卡异常退到其他银行卡
	 */
	OTHER_BANKCARD = "OTHER_BANKCARD"
};