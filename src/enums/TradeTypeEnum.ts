/**
 * 交易类型
 * @author BitterCoffee
 *
 */
export enum TradeTypeEnum {
	/**
	 * JSAPI支付（或小程序支付）
	 */
	JSAPI = "JSAPI", 
	/**
	 * Native支付
	 */
	NATIVE = "NATIVE",
	/**
	 * app支付
	 */
	APP = "APP",
	/**
	 * H5支付
	 */
	MWEB = "MWEB",
	/**
	 * 付款码支付
	 */
	MICROPAY = "MICROPAY"
};