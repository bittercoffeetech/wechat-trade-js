import { Expose } from 'class-transformer';

import { ResultStatusEnum } from '../enums/ResultStatusEnum';
import { SHEET_ERROR_MESSAGES } from './ErrorCodes';

/**
 * 返回信息
 */
 export class TradeReturn {

	/**
	 * 返回状态码 SUCCESS/FAIL 此字段是通信标识，非交易标识，交易是否成功需要查看result_code来判断
	 */
	@Expose({ name: 'return_code' })
	private _returnCode!: ResultStatusEnum;

	/**
	 * 返回信息，如非空，未知错误原因,签名失败,参数格式校验错误
	 */
	@Expose({ name: 'return_msg' })
	private _returnMessage?: string;

	/**
     * 下载交易账单返回的错误代码
     */
	@Expose({ name: 'error_code' })
	private _errorCode?: string;

	get isSuccess(): boolean {
		return ResultStatusEnum.SUCCESS == this._returnCode;
	}

	get errorCode(): string {
		return this._errorCode ? this._errorCode : this._returnCode;
	}

	get errorMessage(): string | undefined{
		if(this._returnMessage && SHEET_ERROR_MESSAGES[this._returnMessage]) {
			return SHEET_ERROR_MESSAGES[this._returnMessage];
		} else if(this.errorCode && SHEET_ERROR_MESSAGES[this.errorCode]) {
			return SHEET_ERROR_MESSAGES[this.errorCode];
		} else {
			return this._returnMessage;
		}
	}
}