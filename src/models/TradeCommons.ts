import { Expose } from 'class-transformer';
import { SignTypeEnum } from '../enums/SignTypeEnum';
import { ResultStatusEnum } from '../enums/ResultStatusEnum';

export class TradeAppModel {

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

export class TradeSignatureModel extends TradeAppModel {

    /**
     * 干扰字符串
     */
    @Expose({ name: 'nonce_str' })
    nonceStr!: string;

	/**
	 * 签名算法
	 */
    @Expose({ name: 'sign_type' })
    signType: SignTypeEnum = SignTypeEnum.MD5;

	/**
	 * 签名
	 */
    @Expose({ name: 'sign' })
    sign!: string;
}

/**
 * 返回信息
 */
export class TradeReturnModel {
    
	/**
	 * 返回状态码 SUCCESS/FAIL 此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断
	 */
    @Expose({ name: 'return_code' })
    returnCode!: ResultStatusEnum;

	/**
	 * 返回信息，如非空，未知错误原因,签名失败,参数格式校验错误
	 */
    @Expose({ name: 'return_msg' })
    returnMessage?: string;

    isSuccess(): boolean {
        return ResultStatusEnum.SUCCESS == this.returnCode;
    }
}

export class TradeErrorReturnModel extends TradeReturnModel {
    
    /**
     * 错误代码
     */
    @Expose({ name: 'error_code' })
    errorCode?: string;
}

export class TradeResultModel {
	/**
	 * 返回状态码 SUCCESS/FAIL
	 */
    @Expose({ name: "result_code" })
    resultCode!: ResultStatusEnum;

	/**
	 * 错误代码
	 */
    @Expose({ name: "err_code" })
    errorCode!: string;

	/**
	 * 错误代码描述
	 */
    @Expose({ name: "err_code_des" })
    errorMessage?: string;

    isSuccess(): boolean {
        return ResultStatusEnum.SUCCESS == this.resultCode;
    }
}