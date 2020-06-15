/**
 * 账单类型
 * 
 * @author BitterCoffee
 *
 */
export const enum BillTypeEnum {
	
	/**
	 * （默认值），返回当日所有订单信息（不含充值退款订单）
	 */
	ALL = "ALL",
	
	/**
	 * 返回当日成功支付的订单（不含充值退款订单）
	 */
	SUCCESS = "SUCCESS",
	
	/**
	 * 返回当日退款订单（不含充值退款订单）
	 */
    REFUND = "REFUND",   
};