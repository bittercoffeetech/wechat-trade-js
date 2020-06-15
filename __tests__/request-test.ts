import moment from "moment";
import { TradeCreateModel, TradeSceneInfo } from "../src/models/TradeCreateModels";
import {TradeBillRefundInfo} from '../src/models/TradeSheetResponseModels'
import { TradeTypeEnum } from "../src/enums/TradeTypeEnum";
import { classToPlain } from 'class-transformer';
import 'jest';
import { parse as toJson } from 'fast-xml-parser';
import { classToPlain, plainToClass } from 'class-transformer';
import { TradeRefundQueryModel, TradeRefundQueryResponseModel } from "../src/models/TradeRefundQueryModel";
import "reflect-metadata";
import { ApiField } from "../src/decorators";
import { RefundStatusEnum } from '../src/enums/RefundStatusEnum';
import { isObject } from "util";
import {hierarchy, decrypt} from '../src/response';
// import * as csv from 'csvtojson';

// test('Plain to Wechat Request Xml', () => {

//     let cm = new TradeCreateModel(TradeTypeEnum.JSAPI, 10000, 'pay');
//     cm.attach = 'haha';
//     let si = new TradeSceneInfo();;
//     si.id = '1';
//     si.name = 'xiao';
//     si.areaCode = '100040';
//     si.address = 'BYJY';
//     cm.sceneInfo = si; 
//     cm.timeStart = moment().utcOffset('+08:00').add(1, 'year');
//     cm.timeExpire = moment().utc();

//     console.log(classToPlain(cm));
// });

// test('decrypt refund notify', () => {
//     let xml = "<xml><return_code>SUCCESS</return_code><appid><![CDATA[wx8949c222019862f5]]></appid><mch_id><![CDATA[1234539902]]></mch_id><nonce_str><![CDATA[de4e47447977e3dcb3eb9387fbf762c9]]></nonce_str><req_info><![CDATA[uvKMQDEpn3NlbNP8QzKttALjM+vbORI2+L4GpbD0hO46Vt7eE33JxdAniQTiGL+VY/yyXB7GGE75LbBznrU3H/hHL45whraQtilM1EymKOK2nBZ94wbKxe2AfnYKrekaL25VEXzibrcsktDTN7naWHC8HkCkdl8zq2/lo69dZP8nCipE0VKSfMeXF5IFDKuMBPlhJ1sLX9qRyB+SkuWwFvhIbenaQi5ur7RyUuzgMbch+mDKI1FCD6664IKFycI+nihJQval6g9AdEWbHX0nK/sm6Kdz2OrGClo6KAWKxsXyTQDzecHrLr7F48NFaUz82G38RkE0o9S8dudpgIIDpw4n2B6u0GFVmu0HDk0wHtFC5DSzST0bRdOu3w9BVwicrvcYqcpEkheeJw3+Mh6tM3oYHzp6oC6fA3tXlVhYoVJeknEZWXt85v5+F4DlOn9z7X5gFUn2VHFdGgd+AMYW0BvcBUJmLupWfT96v9yC4YtvYTsn8SPIhpHRU7fRXGpnBcRyapRdTyQ79PuqQ1UCc7swLHA9vHAZX2fv+o8zuczxjARBCAV4F9hYX2dU4gVNs14mfwPwxUBzZEyvTNzMJlg4mphMCmlZcuKBsUzIRmmvMnKrFMdgDBsTEdfU/5Tu6RAP46rgK0y1nKafmkaoBAFzUFbmWHHl2xkub5wGimacHOT+TgxBSO3LUjGk5zPhnX8XJ320fm1p3l5XfoIazFaeC2kTLdwLXHkAGe08e8eesl7fOgQ1lJfW+dMFNV7BviFnDW5++zzv2pw4ZvttjeUgSY5HYioIgCJSG/t+L5DxlsvDv+O7Yr4JvBjTKswmcq+zpg2M8aaX5MbEe9vJHP40tTZK051rUQAPW2iEKCDVMBgsj+U0IhZDVwr9zMxb+8dSAsnbrzjj1gnCJkpbncFWIl08RTZxl80oqL6ak0F4Ios2QuxtaRDSz3LrqdkSBYi17Ut95+wlgqEmekr0NCZ26EFcfnp7qfbbh33LGA+1ZteWjQKueWxBsMuCtBvKhJomn2Wga6qrAfBxYdUES8opno7wj5iNhs0qBUQfyr8FQechAeX3j4fMrPcHg1r/CJN770qx3d+WB+Nk7EkJDWVCAeKSbGDQ0E5jYILTnVM=]]></req_info></xml>";
//     let j = toJson(xml);
//     let out = decrypt(j.xml.req_info, 'a10add3849ba56abbe56e056f20f883f');
//     console.log(out);
//     expect(out["out_trade_no"]).toBe('84280431833077320492059492239636');
// });

// test('hierarchy plain', () => {

//     let xml = "<xml>" +
//         "    <appid>wx8949c222019862f5</appid>" +
//         "    <cash_fee>30000</cash_fee>" +
//         "    <mch_id>1234539902</mch_id>" +
//         "    <nonce_str>DpTKaiQ72EoESdTQ</nonce_str>" +
//         "    <out_refund_no_0>75167150755995423145699611039343</out_refund_no_0>" +
//         "    <out_trade_no>88120539723913062068499338375453</out_trade_no>" +
//         "    <refund_account_0>REFUND_SOURCE_UNSETTLED_FUNDS</refund_account_0>" +
//         "    <refund_channel_0>ORIGINAL</refund_channel_0>" +
//         "    <refund_count>2</refund_count>" +
//         "    <refund_fee>23000</refund_fee>" +
//         "    <refund_fee_0>23000</refund_fee_0>" +
//         "    <refund_id_0>50300004422020051700563716683</refund_id_0>" +
//         "    <refund_recv_accout_0>支付用户的零钱</refund_recv_accout_0>" +
//         "    <refund_status_0>SUCCESS</refund_status_0>" +
//         "    <refund_success_time_0>2020-05-17 21:00:16</refund_success_time_0>" +
//         "    <result_code>SUCCESS</result_code>" +
//         "    <return_code>SUCCESS</return_code>" +
//         "    <return_msg>OK</return_msg>" +
//         "    <sign>05B034DAE15962AD67FCE50F3EA605BE</sign>" +
//         "    <total_fee>30000</total_fee>" +
//         "    <transaction_id>4200000549202005179867113224</transaction_id>" +
//         "    <refund_fee_1>999999</refund_fee_1>" +
//         "    <coupon_refund_count_1>1</coupon_refund_count_1>" +
//         "    <coupon_refund_fee_1>100</coupon_refund_fee_1>" +
//         "    <coupon_refund_id_1_0>abc</coupon_refund_id_1_0>" +
//         "    <coupon_refund_fee_1_0>1000</coupon_refund_fee_1_0>" +
//         "    <coupon_type_1_0>CASH</coupon_type_1_0>" +
//         "</xml>";

//     let j = toJson(xml, { parseTrueNumberOnly: true }).xml;
//     let out = hierarchy(TradeRefundQueryResponseModel, j);
//     console.log('-----------');
//     console.log(out);

//     plainToClass(TradeRefundQueryResponseModel, out);

//     expect(out.refunds[1].coupons.length).toBe(1);
//     console.log(out.refunds[1].coupons);

// });

it('csv response', async () => {
    const csv=require('csvtojson')
    let a = Date.now();
    await csv({
        noheader:false,
        output: "json",
        delimiter: ','
    })
    .fromString('trade_time,app_id, mch_id, sub_mch_id, device_info,transaction_id, trade_no,open_id, trade_type, trade_status, bank_type, fee_type, settlement_total_fee,coupon_fee,refund_time, refund_success_time, refund_id, refund_no, refunded_fee, refund_coupon_fee,refund_channel, refund_status, body, attach, service_fee, rate, total_fee, refund_fee,rate_desc\n'+
    '`2020-04-01 13:44:57,`wx8949c222019862f5,`1234539902,`0,`,`4200000472202004011622497871,`70379370416862011154184363335444,`oenOB4hv4gbMsjln8390tD3rEN5k,`JSAPI,`REFUND,`ICBC_DEBIT,`CNY,`0.00,`0.00,`2020-04-01 14:16:13,`2020-04-01 14:16:17,`50300704112020040115372577017,`46643757494149190670976216892493,`260.00,`0.00,`ORIGINAL,`SUCCESS,`押金支付,`,`-1.56000,`0.60%,`0.00,`260.00,`'
    .replace(/`/g, "")) 
    .then((csvRow)=>{ 
        console.log(csvRow)
        let v = plainToClass(TradeBillRefundInfo, csvRow[0]);
        console.log(v.refundSuccessTime);
        console.log(v.refundTime);
    })

    console.log(Date.now() - a);

});