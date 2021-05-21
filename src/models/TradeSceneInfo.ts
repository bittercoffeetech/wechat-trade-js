import { Expose } from 'class-transformer';

/**
 * 门店信息
 */
 export class TradeSceneInfo {

	/**
	 * 门店id 门店编号，由商户自定义
	 */
	id!: string;

	/**
	 * 门店名称 门店名称 ，由商户自定义
	 */
	name!: string;

	/**
	 * 门店行政区划码 门店所在地行政区划码
	 */
	@Expose({ name: "area_code" })
	areaCode!: string;

	/**
	 * 门店详细地址 门店详细地址 ，由商户自定义
	 */
	address?: string;
}