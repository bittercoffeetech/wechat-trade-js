/**
 * 交易状态
 * 
 * @author BitterCoffee
 *
 */
export enum TradeStatusEnum {
	/**
	 * 支付成功
	 */
	SUCCESS = "SUCCESS", 
	/**
	 * REFUND
	 */
	REFUND = "REFUND",
	/**
	 * 未支付
	 */
	NOTPAY = "NOTPAY",
	/**
	 * 已关闭
	 */
	CLOSED = "CLOSED",
	/**
	 * 已撤销（刷卡支付）
	 */
	REVOKED = "REVOKED",
	/**
	 * 用户支付中
	 */
	USERPAYING = "USERPAYING",
	/**
	 * 支付失败 = 其他原因，如银行返回失败
	 */
	PAYERROR = "PAYERROR"
};