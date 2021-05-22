import { Expose } from 'class-transformer';

import { SignTypeEnum } from '../enums/SignTypeEnum';
import { TradeAppInfo } from './TradeAppInfo';

/**
 * 签名信息
 */
 export class TradeSignatureInfo extends TradeAppInfo {

    /**
     * 干扰字符串
     */
	@Expose({ name: 'nonce_str' })
	nonceStr!: string;

	/**
	 * 签名算法
	 */
	@Expose({ name: 'sign_type' })
	signType?: SignTypeEnum;

	/**
	 * 签名
	 */
	@Expose({ name: 'sign' })
	sign!: string;
}