import 'jest';
import { parse as toJson } from 'fast-xml-parser';
import { plainToClass } from "class-transformer";
import rewire from 'rewire';
import { SignTypeEnum } from '../src/enums/SignTypeEnum';
import { TradeReturnModel, TradeResultModel } from '../src/models/TradeCommons';
import { resolve } from 'path';
import fs from 'fs';
import { TradeBillRefundAction } from '../src/actions/SheetActions';

test('Test Sign Algorithm', () => {

    let toSign = {
        'appid': 'wx8949c222019862f5',
        'mch_id': '1234539902',
        'nonce_str': '05381462014616644751868586145240',
        'sign': '0188F350D33A56AF1160AE69F4AAC3E7',
        'out_trade_no': '59082615869476245890799813201417',
        'total_fee': 30000,
        'notify_url': 'https://bike.yxbhlt.cn:9999/api/v1/wechat/refund/notify',
        'refund_fee': 23000,
        'out_refund_no': '17899357909836346900870462540973'
    };

    const clientModule = rewire("../dist/WechatTradeClient.js");
    const sign = clientModule.__get__("sign");

    expect(sign(toSign, SignTypeEnum.MD5)).toBe('0188F350D33A56AF1160AE69F4AAC3E7');
});

test('Test Response Sign', () => {

    let xml = "<xml><return_code><![CDATA[SUCCESS]]></return_code>" + 
    "<return_msg><![CDATA[OK]]></return_msg>" + 
    "<appid><![CDATA[wx8949c222019862f5]]></appid>" + 
    "<mch_id><![CDATA[1234539902]]></mch_id>" + 
    "<nonce_str><![CDATA[85UCoqTOxXhlzgVd]]></nonce_str>" + 
    "<sign><![CDATA[20FE468851E4B1F2193B9DAAEBE824DF]]></sign>" + 
    "<result_code><![CDATA[SUCCESS]]></result_code>" + 
    "<openid><![CDATA[oenOB4tQ2pKtKuWSp6eGwf9XNjsY]]></openid>" + 
    "<is_subscribe><![CDATA[N]]></is_subscribe>" + 
    "<trade_type><![CDATA[JSAPI]]></trade_type>" + 
    "<bank_type><![CDATA[COMM_DEBIT]]></bank_type>" + 
    "<total_fee>30000</total_fee>" + 
    "<fee_type><![CDATA[CNY]]></fee_type>" + 
    "<transaction_id><![CDATA[4200000536202005163811292828]]></transaction_id>" + 
    "<out_trade_no><![CDATA[90013580520959892632499715588959]]></out_trade_no>" + 
    "<attach><![CDATA[]]></attach>" + 
    "<time_end><![CDATA[20200516095807]]></time_end>" + 
    "<trade_state><![CDATA[REFUND]]></trade_state>" + 
    "<cash_fee>30000</cash_fee>" + 
    "<trade_state_desc><![CDATA[订单发生过退款，退款详情请查询退款单]]></trade_state_desc>" + 
    "<cash_fee_type><![CDATA[CNY]]></cash_fee_type>" + 
    "</xml>";

    let j = toJson(xml);
    const clientModule = rewire("../dist/WechatTradeClient.js");
    const sign = clientModule.__get__("sign");

    expect(sign(j.xml, SignTypeEnum.MD5)).toBe('20FE468851E4B1F2193B9DAAEBE824DF');

});

test('Test REQ_INFO of Refund Notify Decrypt', () => {
    let enc = "uvKMQDEpn3NlbNP8QzKttALjM+vbORI2+L4GpbD0hO46Vt7eE33JxdAniQTiGL+VY/yyXB7GGE75LbBznrU3H/hHL45whraQtilM1EymKOK2nBZ94wbKxe2AfnYKrekaL25VEXzibrcsktDTN7naWHC8HkCkdl8zq2/lo69dZP8nCipE0VKSfMeXF5IFDKuMBPlhJ1sLX9qRyB+SkuWwFvhIbenaQi5ur7RyUuzgMbch+mDKI1FCD6664IKFycI+nihJQval6g9AdEWbHX0nK/sm6Kdz2OrGClo6KAWKxsXyTQDzecHrLr7F48NFaUz82G38RkE0o9S8dudpgIIDpw4n2B6u0GFVmu0HDk0wHtFC5DSzST0bRdOu3w9BVwicrvcYqcpEkheeJw3+Mh6tM3oYHzp6oC6fA3tXlVhYoVJeknEZWXt85v5+F4DlOn9z7X5gFUn2VHFdGgd+AMYW0BvcBUJmLupWfT96v9yC4YtvYTsn8SPIhpHRU7fRXGpnBcRyapRdTyQ79PuqQ1UCc7swLHA9vHAZX2fv+o8zuczxjARBCAV4F9hYX2dU4gVNs14mfwPwxUBzZEyvTNzMJlg4mphMCmlZcuKBsUzIRmmvMnKrFMdgDBsTEdfU/5Tu6RAP46rgK0y1nKafmkaoBAFzUFbmWHHl2xkub5wGimacHOT+TgxBSO3LUjGk5zPhnX8XJ320fm1p3l5XfoIazFaeC2kTLdwLXHkAGe08e8eesl7fOgQ1lJfW+dMFNV7BviFnDW5++zzv2pw4ZvttjeUgSY5HYioIgCJSG/t+L5DxlsvDv+O7Yr4JvBjTKswmcq+zpg2M8aaX5MbEe9vJHP40tTZK051rUQAPW2iEKCDVMBgsj+U0IhZDVwr9zMxb+8dSAsnbrzjj1gnCJkpbncFWIl08RTZxl80oqL6ak0F4Ios2QuxtaRDSz3LrqdkSBYi17Ut95+wlgqEmekr0NCZ26EFcfnp7qfbbh33LGA+1ZteWjQKueWxBsMuCtBvKhJomn2Wga6qrAfBxYdUES8opno7wj5iNhs0qBUQfyr8FQechAeX3j4fMrPcHg1r/CJN770qx3d+WB+Nk7EkJDWVCAeKSbGDQ0E5jYILTnVM=";

    const clientModule = rewire("../dist/WechatTradeClient.js");
    const decrypt = clientModule.__get__("decrypt");
    let out = decrypt(enc, 'a10add3849ba56abbe56e056f20f883f');

    expect(out["out_trade_no"]).toBe('84280431833077320492059492239636');
});

test('Test Hierarchy Plain', () => {

    let xml = "<xml>" +
        "    <appid>wx8949c222019862f5</appid>" +
        "    <cash_fee>30000</cash_fee>" +
        "    <mch_id>1234539902</mch_id>" +
        "    <nonce_str>DpTKaiQ72EoESdTQ</nonce_str>" +
        "    <out_refund_no_0>75167150755995423145699611039343</out_refund_no_0>" +
        "    <out_trade_no>88120539723913062068499338375453</out_trade_no>" +
        "    <refund_account_0>REFUND_SOURCE_UNSETTLED_FUNDS</refund_account_0>" +
        "    <refund_channel_0>ORIGINAL</refund_channel_0>" +
        "    <refund_count>2</refund_count>" +
        "    <refund_fee>23000</refund_fee>" +
        "    <refund_fee_0>23000</refund_fee_0>" +
        "    <refund_id_0>50300004422020051700563716683</refund_id_0>" +
        "    <refund_recv_accout_0>支付用户的零钱</refund_recv_accout_0>" +
        "    <refund_status_0>SUCCESS</refund_status_0>" +
        "    <refund_success_time_0>2020-05-17 21:00:16</refund_success_time_0>" +
        "    <result_code>SUCCESS</result_code>" +
        "    <return_code>SUCCESS</return_code>" +
        "    <return_msg>OK</return_msg>" +
        "    <sign>05B034DAE15962AD67FCE50F3EA605BE</sign>" +
        "    <total_fee>30000</total_fee>" +
        "    <transaction_id>4200000549202005179867113224</transaction_id>" +
        "    <refund_fee_1>999999</refund_fee_1>" +
        "    <coupon_refund_count_1>1</coupon_refund_count_1>" +
        "    <coupon_refund_fee_1>100</coupon_refund_fee_1>" +
        "    <coupon_refund_id_1_0>abc</coupon_refund_id_1_0>" +
        "    <coupon_refund_fee_1_0>1000</coupon_refund_fee_1_0>" +
        "    <coupon_type_1_0>CASH</coupon_type_1_0>" +
        "</xml>";

    let values = toJson(xml, { parseTrueNumberOnly: true }).xml;
    const clientModule = rewire("../dist/WechatTradeClient.js");
    const hierarchy = clientModule.__get__("hierarchy");

    const modelModule = rewire("../dist/models/TradeRefundQueryModels.js");
    let model = modelModule.__get__('TradeRefundQueryResponseModel');

    let hvalues = hierarchy(model, values);
    let result = plainToClass(model, hvalues);

    expect(result["refunds"].length).toBe(2);
    expect(result['refund_fee']).toBe(23000);
});

it('Test CSV Response Parse', async () => {

    const rootModule = rewire("../dist/WechatTradeClient.js");
    let parseCsvResponse = rootModule.__get__('parseCsvResponse');

    const csvModule = rewire("../dist/models/TradeSheetModels.js");
    csvModule.__get__('TradeBillSummaryInfo');
    csvModule.__get__('TradeBillRefundInfo');

    await parseCsvResponse(fs.readFileSync(resolve('./__tests__/data/refund.txt')).toString(),  TradeBillRefundAction)
        .then((v: any) => {
            console.log(v);
            expect(v.summary.totalTrades).toBe(72);
            expect(v.records.length).toBe(2);
        });

});

test("Test Return failed.", () => {

    let xml = "<xml>" +
        "    <appid>wx8949c222019862f5</appid>" +
        "    <cash_fee>30000</cash_fee>" +
        "    <mch_id>1234539902</mch_id>" +
        "    <nonce_str>DpTKaiQ72EoESdTQ</nonce_str>" +
        "    <out_refund_no_0>75167150755995423145699611039343</out_refund_no_0>" +
        "    <out_trade_no>88120539723913062068499338375453</out_trade_no>" +
        "    <result_code>FAIL</result_code>" +
        "    <return_msg>签名错误</return_msg>" +
        "    <return_code>FAIL</return_code>" +
        "    <err_code>INVALID_REQUEST</err_code>" +
        "    <err_code_des>参数错误</err_code_des> " +
        "</xml>";

    let values = toJson(xml, { parseTrueNumberOnly: true }).xml;
    let returnModel = plainToClass(TradeReturnModel, values, {excludeExtraneousValues: true});
    expect(returnModel.isSuccess).toBeFalsy();

    let resultModel = plainToClass(TradeResultModel, values, {excludeExtraneousValues: true});
    expect(resultModel.isSuccess).toBeFalsy();
    expect(resultModel.errorCode).toBe('INVALID_REQUEST');

});