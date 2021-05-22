import { Expose } from 'class-transformer';

import { ResultStatusEnum } from '../enums/ResultStatusEnum';

/**
 * 下载账单返回的错误信息
 */

 export const SheetErrorMessages = {
	"sign error":"签名错误",
	"nonce_str too long":"参数nonce_str错误",
	"invalid tar_type: Only GZIP supported":"参数tar_type错误",
	"invalid bill_type":"参数bill_type错误",
	"invalid bill_date":"参数bill_date错误",
	"require POST method":"请求方式错误",
	"empty post data":"请求报文错误",
	"data format error":"参数格式错误",
	"missing parameter":"缺少参数",
	"invalid appid":"appid错误",
	"invalid parameter":"参数错误",
	"No Bill Exist":"账单不存在",
	"Bill Creating":"账单未生成",
	"system error":"下载失败",
	"100":"下载失败",
	"20003":"下载失败",
	"20007":"当前商户号账单API权限已经关闭"
 };

/**
 * 返回信息
 */
 export class TradeReturnInfo {

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
		if(this._returnMessage && SheetErrorMessages[this._returnMessage]) {
			return SheetErrorMessages[this._returnMessage];
		} else if(this.errorCode && SheetErrorMessages[this.errorCode]) {
			return SheetErrorMessages[this.errorCode];
		} else {
			return this._returnMessage;
		}
	}
}