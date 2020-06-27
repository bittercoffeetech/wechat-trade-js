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

/**
 * 退款发起来源
 * 
 * @author BitterCoffee
 *
 */
export enum RefundRequestSourceEnum {
	/**
	 * API接口
	 */
	API = "API", 
	/**
	 * 商户平台
	 */
	VENDOR_PLATFORM = "VENDOR_PLATFORM"
};

/**
 * 退款状态
 * 
 * @author BitterCoffee
 *
 */
export enum RefundStatusEnum {
	
	/**
	 * 成功
	 */
	SUCCESS = "SUCCESS",
	
	/**
	 * 退款异常，退款到银行发现用户的卡作废或者冻结了，导致原路退款银行卡失败，可前往商户平台（pay.weixin.qq.com）-交易中心，手动处理此笔退款。
	 */
	CHANGE = "CHANGE",
	
	/**
	 * 退款关闭
	 */
	REFUNDCLOSE = "REFUNDCLOSE",
	
	/**
	 * 退款处理中
	 */
	PROCESSING = "PROCESSING"
};