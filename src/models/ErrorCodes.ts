/**
 * 接口返回的错误信息代码
 */
 export const API_ERROR_MESSAGES = {
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
 * 下载账单返回的错误信息
 */

 export const SHEET_ERROR_MESSAGES = {
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