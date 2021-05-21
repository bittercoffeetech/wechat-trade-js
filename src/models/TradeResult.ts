import { Expose } from 'class-transformer';

import { ResultStatusEnum } from '../enums/ResultStatusEnum';

/**
 * 业务结果
 */
 export class TradeResult {
	/**
	 * 返回状态码 SUCCESS/FAIL
	 */
	@Expose({ name: "result_code" })
	private resultCode!: ResultStatusEnum;

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

	get isSuccess(): boolean {
		return ResultStatusEnum.SUCCESS == this.resultCode;
	}
}