/**
 * 表格数据返回对象模型
 */
 export class TradeDownloadResponse<ST, RT> {
	summary!: ST; 
	records: RT[] = new Array<RT>();
}