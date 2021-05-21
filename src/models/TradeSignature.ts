import { Expose } from 'class-transformer';

import { SignTypeEnum } from '../enums/SignTypeEnum';
import { TradeApp } from './TradeApp';

/**
 * 签名信息
 */
 export class TradeSignature extends TradeApp {

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