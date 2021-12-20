import { Expose, Type } from 'class-transformer';

import { TradeGoodInfo } from './TradeGoodInfo';

/**
 * 商品详情
 */
 export class TradeGoodsDetailInfo {
    /**
	 * 订单原价
	 * 
	 * <ul>
	 * <li>1.商户侧一张小票订单可能被分多次支付，订单原价用于记录整张小票的交易金额。</li>
	 * <li>2.当订单原价与支付金额不相等，则不享受优惠。</li>
	 * <li>3.该字段主要用于防止同一张小票分多次支付，以享受多次优惠的情况，正常支付订单不必上传此参数。</li>
	 * </ul>
	 */
	@Expose({ name: "cost_price" })
	costPrice!: number;

	/**
	 * 商品小票ID
	 */
	@Expose({ name: "receipt_id" })
	receiptId!: string;

	/**
	 * 单品列表 单品信息，使用Json数组格式提交
	 * 
	 * @see GoodInfo
	 */
	@Expose({ name: "goods_detail" })
	@Type(() => TradeGoodInfo)
	goods?: TradeGoodInfo[];
}