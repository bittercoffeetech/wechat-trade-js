/**
 * 接口返回的错误信息代码
 */
 export const WechatApiErrorMessages = {
	'SYSTEMERROR' : "系统错误",
	'XML_FORMAT_ERROR' : "XML格式错误",
	'APPID_NOT_EXIST' : "APPID不存在",
	'MCHID_NOT_EXIST' : "MCHID不存在",
	'APPID_MCHID_NOT_MATCH' : "appid和mch_id不匹配",
	'SIGNERROR' : "签名错误",
	'REQUIRE_POST_METHOD' : "请使用post方法",
	'NOAUTH' : "商户无此接口权限",
	'INVALID_REQUEST' : "参数错误",
	'LACK_PARAMS' : "缺少参数",
	'POST_DATA_EMPTY' : "post数据为空",
	'NOT_UTF8' : "编码格式错误",
	'NOTENOUGH' : "余额不足",
	'ORDERPAID' : "商户订单已支付",
	'ORDERCLOSED' : "订单已关闭",
	'OUT_TRADE_NO_USED' : "商户订单号重复",
	'PARAM_ERROR' : "参数错误",
	'INVALID_REQ_TOO_MUCH' : "无效请求过多",
	'FREQUENCY_LIMITED' : "频率限制",
	'CERT_ERROR' : "证书校验错误",
	'INVALID_TRANSACTIONID' : "无效transaction_id",
	'BIZERR_NEED_RETRY' : "退款业务流程错误，需要商户触发重试来解决",
	'TRADE_OVERDUE' : "订单已经超过退款期限",
	'ERROR' : "业务错误",
	'USER_ACCOUNT_ABNORMAL' : "退款请求失败",
	'REFUND_FEE_MISMATCH' : "订单金额或退款金额与之前请求不一致，请核实后再试",
	'ORDER_NOT_READY' : "订单处理中，暂时无法退款，请稍后再试",
	'REFUNDNOTEXIST' : "退款订单查询失败"
};

/**
 * 接口调用返回的错误信息封装的异常类
 */
 export class WechatApiError extends Error {
    code: string;
    constructor(code: string, message?: string) {
        super(message);
        this.code = code;
    }
}