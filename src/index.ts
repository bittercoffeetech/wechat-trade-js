// import { TreeMap, Collections } from "typescriptcollectionsframework"
// import { SignTypeEnum } from './enums';
import { j2xParser as toXml } from 'fast-xml-parser';
import {  parse as toJson } from 'fast-xml-parser';
// import { TradeSignatureModel } from './models/TradeHeader';
import { classToPlain, plainToClass } from 'class-transformer';
// import { SignTypeEnum } from './enums/SignTypeEnum';
import { TradeCreateModel, TradeSceneInfo } from "./models/TradeCreateModels";
import { TradeTypeEnum } from "./enums/TradeTypeEnum";
import moment from 'moment';
import { TradeSignatureModel } from './models/TradeCommons';
import { SignTypeEnum } from './enums/SignTypeEnum';

var xml = "<xml><appid><![CDATA[wx8949c222019862f5]]></appid>\n" + 
"<bank_type><![CDATA[ABC_CREDIT]]></bank_type>\n" + 
"<cash_fee><![CDATA[30000]]></cash_fee>\n" + 
"<fee_type><![CDATA[CNY]]></fee_type>\n" + 
"<sign_type><![CDATA[MD5]]></sign_type>\n" + 
"<is_subscribe><![CDATA[N]]></is_subscribe>\n" + 
"<mch_id><![CDATA[1234539902]]></mch_id>\n" + 
"<nonce_str><![CDATA[82784474056159375379525796738557]]></nonce_str>\n" + 
"<openid><![CDATA[oenOB4lS8ZxHniQtaf455UbvhLHI]]></openid>\n" + 
"<out_trade_no><![CDATA[54468989721541219324177967799889]]></out_trade_no>\n" + 
"<result_code><![CDATA[SUCCESS]]></result_code>\n" + 
"<return_code><![CDATA[SUCCESS]]></return_code>\n" + 
"<sign><![CDATA[37AE598C40C5742A9EB30BC95BA06F1B]]></sign>\n" + 
"<time_end><![CDATA[20200418152047]]></time_end>\n" + 
"<total_fee>30000</total_fee>\n" + 
"<trade_type><![CDATA[JSAPI]]></trade_type>\n" + 
"<transaction_id><![CDATA[4200000533202004182563767929]]></transaction_id>\n" + 
"</xml>";
// var m = new TreeMap<number, string>(Collections.getNumberComparator())

// m.put(18, "abc20002");
// m.put(2, "def3333222");


// var it = m.keySet().iterator();

// while(it.hasNext()) {
//     console.log(it.next());
// }

// // var ok = new TradeReturnModel('FAIL', 'eeee', 'aaaa');
// // console.log(ok.returnCode);
// // console.log(ok.returnMessage);
// // console.log(ok.errorCode);

let j = toJson(xml);
// console.log(j.xml);

let app: TradeSignatureModel = plainToClass(TradeSignatureModel, j.xml );
console.log("============");
console.log(app.appId);
console.log(app.mchId);
console.log(app.nonceStr);
console.log(app.signType == SignTypeEnum.MD5);
console.log(app.sign);
console.log("============");

// console.log(new toXml({}).parse({xml: {...app}}));

let cm = new TradeCreateModel(TradeTypeEnum.JSAPI, 10000, 'pay');
cm.attach = 'haha';
let si = new TradeSceneInfo();;
si.id = '1';
si.name = 'xiao';
si.areaCode = '100040';
si.address = 'BYJY';
cm.sceneInfo = si; 
cm.timeStart = moment().utcOffset('+08:00').add(1, 'year');
cm.timeExpire = moment().utc();

let plain = classToPlain(cm);
console.log('==========1111111===========');
console.log(plain);
console.log('===========22222=========');

console.log(new toXml({
    format: true,
    tagValueProcessor : (value: string) => '<![CDATA[' + value + ']]>'
}).parse({xml: plain}));

console.log(moment().utcOffset('+08:00'));
