import { Expose } from 'class-transformer';

/**
 * 应用标识
 */
 export class TradeApp {

    /**
     * 应用标识
     */
	@Expose({ name: 'appid' })
	appId!: string;

    /**
     * 商户标识
     */
	@Expose({ name: 'mch_id' })
	mchId!: string;
}