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