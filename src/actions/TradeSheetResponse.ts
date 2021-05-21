/**
 * 账单类型返回对象
 */
 export interface TradeSheetResponse<ST, RT> {
	/**
	 * 概要信息对应的模型类
	 */
	summaryType: { new(...args: any[]) : ST };

	/**
	 * 详细信息对应的模型类
	 */
	recordType: { new(...args: any[]) : RT };
}