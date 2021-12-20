import { Expose } from 'class-transformer';

import { TradeId, TradeNoInfo } from './TradeNoInfo';

/**
 * 退款ID类型，区分使用哪个ID来进行退款查询
 */
export type RefundId = TradeId | 'rno' | 'rid';

/**
 * 
 * @param id 商户支付单号
 */
export const RTNO = (id: string) : TradeRefundQueryRequest => new TradeRefundQueryRequest("tno", id);

/**
 * 
 * @param id 微信支付交易号
 */
export const RTID = (id: string) : TradeRefundQueryRequest => new TradeRefundQueryRequest("tid", id);

/**
 * 
 * @param id 商户退款单号
 */
export const RNO = (id: string) : TradeRefundQueryRequest => new TradeRefundQueryRequest("rno", id);

/**
 * 
 * @param id 微信退款交易号
 */
export const RID = (id: string) : TradeRefundQueryRequest => new TradeRefundQueryRequest("rid", id);

/**
 * 退款查询
 */
export class TradeRefundQueryRequest extends TradeNoInfo {

	/**
	 * 
	 * @param idType ID类型
	 * @param id ID内容
	 */
	constructor(idType: RefundId, id: string) {
		super(idType as TradeId, id)
		if(idType == 'rno') {
			this.refundNo = id;
		} else if (idType == 'rid') {
			this.refundId = id;
		}
	}

     /**
	 * 商户退款单号 商户系统内部的退款单号，商户系统内部唯一，只能是数字、大小写字母_-|*@ ，同一退款单号多次请求只退一笔。
	 */
	@Expose({ name: "out_refund_no" })
	refundNo!: string;

	/**
	 * 微信退款单号 微信生成的退款单号，在申请退款接口有返回
	 */
	@Expose({ name: "refund_id" })
	refundId?: string;

	/**
	 * 偏移量 偏移量，当部分退款次数超过10次时可使用，表示返回的查询结果从这个偏移量开始取记录
	 */
	@Expose({ name: "offset" })
	offset?: number;
}



