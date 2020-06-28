import 'reflect-metadata';

import axios, { AxiosResponse } from 'axios';
import { classToPlain, plainToClass } from 'class-transformer';
import crypto from 'crypto';
import hmacSha256 from 'crypto-js/hmac-sha256';
import md5 from 'crypto-js/md5';
import csv from 'csvtojson';
import { CSVParseParam } from 'csvtojson/v2/Parameters';
import { j2xParser as toXml, parse as toJson, validate } from 'fast-xml-parser';
import fs from 'fs';
import he from 'he';
import https from 'https';
import { customAlphabet } from 'nanoid';
import nconf from 'nconf';
import { resolve } from 'path';
import { Collections, TreeMap } from 'typescriptcollectionsframework';
import zlib from 'zlib';

import { TradeAction, TradeCsvAction, TradeCsvResponse, TradeXmlResponse } from './actions/base';
import { TradeCreateNotify, TradeRefundNotify } from './actions/notifies';
import { TradeBillAllAction, TradeBillRefundAction, TradeBillSuccessAction, TradeFundflowAction } from './actions/sheets';
import { TradeCloseAction, TradeCreateAction, TradeQueryAction, TradeRefundAction, TradeRefundQueryAction } from './actions/trades';
import { ErrorCodeEnum, SignTypeEnum } from './enums/commons';
import { AccountTypeEnum } from './enums/sheets';
import { API_ERROR_MESSAGES, TradeNoModel, TradeResultModel, TradeReturnModel, WechatApiError, XmlModel } from './models/base';
import { TradeCreateModel, TradeCreateNotifyModel, TradeCreateResponseModel } from './models/pay';
import { TradeQueryResponseModel } from './models/pay_query';
import { TradeRefundModel, TradeRefundNotifyModel, TradeRefundResponseModel } from './models/refund';
import { TradeRefundQueryModel, TradeRefundQueryResponseModel } from './models/refund_query';
import {
    TradeBillAllInfo, TradeBillAllModel, TradeBillRefundInfo, TradeBillRefundModel, TradeBillSuccessInfo, TradeBillSuccessModel, TradeBillSummaryInfo,
    TradeCsvlModel, TradeCsvResponseModel, TradeFundflowInfo, TradeFundflowModel, TradeFundflowSummaryInfo
} from './models/sheets';

nconf.file(resolve('./wechat.config.json'));
const nanoid = customAlphabet('1234567890abcdef', 32);

async function execute<R, S>(action: TradeAction<R, S>, model: R): Promise<S | undefined> {
    if (model == undefined) {
        throw Error("Model Object must not be null");
    }

    let forPost = toXmlRequest(model, action.requestSignType);
    let forResult: S | undefined = undefined;
    var httpsAgent;

    if(action.certificated) {
        httpsAgent = new https.Agent({  
            pfx: fs.readFileSync(resolve(nconf.get('api_cert'))),
            maxVersion: 'TLSv1.2',
            passphrase: nconf.get('mch_id')
          });
    }

    await axios.post(action.url, forPost, {
        responseType: 'text',
        httpsAgent: httpsAgent
    }).then((resp: AxiosResponse<string>) => {
        let values = fetchValues(resp.data);
        checkReturn(values);
        forResult = fromXmlResponse(values, action);
    }).catch((e: WechatApiError) => {
        throw e;
    });

    return forResult;
}

async function download<R extends TradeCsvlModel, ST, RT>(action: TradeCsvAction<R, ST, RT>, model: R): Promise<TradeCsvResponseModel<ST, RT>> {

    if (model == undefined) {
        throw Error("Model Object must not be null");
    }

    let forPost = toXmlRequest(model, action.requestSignType);
    let forResult = new TradeCsvResponseModel<ST, RT>();
    var httpsAgent;
    
    if(action.certificated) {
        httpsAgent = new https.Agent({  
            pfx: fs.readFileSync(resolve(nconf.get('api_cert'))),
            maxVersion: 'TLSv1.2',
            passphrase: nconf.get('mch_id')
          });
    }

    await axios.post(action.url, forPost, {
        responseType: 'arraybuffer',
        httpsAgent: httpsAgent
    }).then(async (resp: AxiosResponse<Buffer>) => {
        if ((resp.headers['content-type'] as string).indexOf('gzip') >= 0) {
            await fromCsvResponse(zlib.unzipSync(resp.data).toString(), action).then((result) => {
                forResult = result;
            });
        } else {
            let data = resp.data.toString();    
            if (validate(data) == true) {
                let values = fetchValues(data);
                checkReturn(values);
            } else {
                await fromCsvResponse(data, action).then((result) => {
                    forResult = result;
                });
            }
        }
    }).catch((e: WechatApiError) => {
        throw e;
    });

    return forResult;
}

function toXmlRequest(request: {}, signType: SignTypeEnum = SignTypeEnum.MD5): string {
    let forSign = {
        ...classToPlain(request),
        ...{
            'appid': nconf.get('appid'),
            'mch_id': nconf.get('mch_id'),
            'nonce_str': nanoid()
        }
    };
    forSign["sign"] = sign(forSign, signType);

    return new toXml({
        format: true,
        tagValueProcessor: (value: string) => '<![CDATA[' + he.escape(value.toString()) + ']]>'
    }).parse({ xml: forSign }).toString();
}

function fetchValues(xml: string) : {} {
    return toJson(xml, { parseTrueNumberOnly: true })["xml"];
}

function checkReturn(values: {}): void {
    let returnModel = plainToClass(TradeReturnModel, values,
        { excludeExtraneousValues: true });
    if (!returnModel.isSuccess) {
        throw new WechatApiError(returnModel.errorCode, returnModel.errorMessage);
    }    
}

function fromXmlResponse<T>(values: {}, response: TradeXmlResponse<T>): T | undefined {
    if(response.hasResult) {
        let resultModel = plainToClass(TradeResultModel, values,
            { excludeExtraneousValues: true });
        if (!resultModel.isSuccess) {
            throw new WechatApiError(resultModel.errorCode, resultModel.errorMessage);
        }
    }

    if (response.responseType == undefined) {
        return undefined;
    } else {
        if (response.hasSigned && sign(values, response.responseSignType) != values['sign']) {
            throw new WechatApiError(ErrorCodeEnum.SIGNERROR, API_ERROR_MESSAGES[ErrorCodeEnum.SIGNERROR]);
        }
        if (response.encrypted != undefined) {
            values = { ...values, ...decrypt(values[response.encrypted], nconf.get('mch_key')) };
            delete values[response.encrypted];
        }
        if (response.hasHierarchy && response.responseType != undefined) {
            values = hierarchy(response.responseType, values);
        }
        return plainToClass(response.responseType, values, { enableImplicitConversion: true, excludeExtraneousValues: true });
    }
}

async function fromCsvResponse<ST, RT>(csvData: string, response: TradeCsvResponse<ST, RT>): Promise<TradeCsvResponseModel<ST, RT>> {

    let hasChineseWord = (text: string): boolean => /.*[\u4e00-\u9fa5]+.*/.test(text);
    let csvParam: Partial<CSVParseParam> = { noheader: true, output: "json", delimiter: ',', ignoreEmpty: true, nullObject: true };
    let summaryLine: string = '';
    let isSummary: boolean = false;
    let result = new TradeCsvResponseModel<ST, RT>();

    await csv({ ...csvParam, headers: Reflect.getMetadata('columns', response.recordType) })
        .fromString(csvData)
        .preFileLine((line: string, index: number) => {
            if (isSummary) { summaryLine = line; return ','; }
            let traw = line.replace(/`/g, "");

            if (hasChineseWord(traw.substr(0, 1))) {
                traw = ',';
                if (index > 0 && !isSummary) { isSummary = true; }
            }
            return traw;
        })
        .then((csvRow: any[]) => {
            for (var i = 0; i < csvRow.length; i++) {
                result.records.push(plainToClass(response.recordType, csvRow[i], { enableImplicitConversion: true }))
            }
        });

    await csv({ ...csvParam, headers: Reflect.getMetadata('columns', response.summaryType) })
        .fromString(summaryLine)
        .preFileLine((line: string, _index: number) => line.replace(/`/g, ""))
        .then((csvRow: any[]) => {
            result.summary = plainToClass(response.summaryType, csvRow[0], { enableImplicitConversion: true });
        });

    return result;
}

function sign(forSign: {}, signType: SignTypeEnum | undefined = SignTypeEnum.MD5): string | undefined {
    var sorted = new TreeMap<string, any>(Collections.getStringComparator());
    for (let prop in forSign) {
        if (forSign[prop] != undefined && forSign[prop] != '' && prop != 'sign') {
            sorted.put(prop, forSign[prop]);
        }
    }
    let params = [];
    let entities = sorted.entrySet().iterator();
    while (entities.hasNext()) {
        let n = entities.next();
        params.push(n.getKey() + "=" + n.getValue());
    }
    params.push("key=" + nconf.get('mch_key'));
    let signString = params.join("&");

    if (SignTypeEnum.MD5 == signType || signType == undefined) {
        return md5(signString).toString().toUpperCase();
    }
    else if (SignTypeEnum.HMAC_SHA256 == signType) {
        return hmacSha256(signString, nconf.get('mch_key')).toString().toUpperCase();
    } else {
        return undefined;
    }
}

function decrypt(content: string, key: string): object {
    let encKey = crypto.createHash("md5").update(key, 'utf8').digest('hex');
    let decipher: crypto.Decipher = crypto.createDecipheriv('aes-256-ecb', encKey, '');
    decipher.setAutoPadding(true);
    let chunks = [];
    chunks.push(decipher.update(content, 'base64', 'utf8'));
    chunks.push(decipher.final('utf8'));

    return toJson(chunks.join(''), { parseTrueNumberOnly: true })["root"];
}

function hierarchy(model: new (...args: any[]) => any, source: object): object {
    let result = {};
    morphValues(model, source, result, []);
    clearValues(source);

    return { ...source, ...result };

    function clearValues(source: object) {
        for (const key of Object.keys(source)) {
            let m = key.match('.*(_)[0-9]+$');
            if (m != null && m.length > 0) {
                delete source[key];
            }
        }
    }

    function morphValues(model: new (...args: any[]) => any, source: object, result: object, levels: number[]): void {
        let suffix: string = levels.length == 0 ? '' : "_" + levels.join("_");

        Reflect.getMetadataKeys(model).forEach((key: string) => {
            let xmlModel = Reflect.getMetadata(key, model) as XmlModel;
            let propName = xmlModel.name + suffix;

            if (xmlModel.subType == undefined) {
                let propValue = source[propName];

                if (propValue != undefined) {
                    result[xmlModel.name] = propValue;
                }
            } else {
                let count: number = source[xmlModel.countName + suffix] as number;

                if (count > 0) {
                    let subObjects = [];
                    for (let i = 0; i < count; i++) {
                        let subObject = {};
                        morphValues(xmlModel.subType, source, subObject, levels.concat(i));
                        subObjects.push(subObject);
                    }
                    result[xmlModel.name] = subObjects;
                }
            }
        });
    }
}

/**
 * 统一下单
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 */
export function createTrade(model: TradeCreateModel): Promise<TradeCreateResponseModel | undefined> {
    return execute(TradeCreateAction, model);
}

/**
 * 订单查询
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 */
export function queryTrade(model: TradeNoModel): Promise<TradeQueryResponseModel | undefined> {
    return execute(TradeQueryAction, model);
}

/**
 * 关闭订单
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 * 
 * @param model {@link TNO} 商户订单号<br>{@link TID} 微信交易号
 */
export function closeTrade(model: TradeNoModel): Promise<undefined> {
    return execute(TradeCloseAction, model);
}

/**
 * 发起退款
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 */
export function createRefund(model: TradeRefundModel): Promise<TradeRefundResponseModel | undefined> {
    return execute(TradeRefundAction, model);
}

/**
 * 查询退款
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 * 
 * @param model {@link RTNO} 商户支付单号<br>{@link RTID} 微信支付交易号<br>{@Link RNO} 商户退款单号<br>{@Link RID} 微信退款交易号
 */
export function queryRefund(model: TradeRefundQueryModel): Promise<TradeRefundQueryResponseModel | undefined> {
    return execute(TradeRefundQueryAction, model);
}

/**
 * 下载所有交易数据
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 * 
 * @param year 年
 * @param month 月
 * @param day 日
 * @param tar 是否使用压缩格式返回
 */
export function downloadBillAll(year: number, month: number, day: number, tar?: boolean): Promise<TradeCsvResponseModel<TradeBillSummaryInfo, TradeBillAllInfo>> {
    return download(TradeBillAllAction, new TradeBillAllModel(year, month, day, tar));
}

/**
 * 下载所有成功的交易数据
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 * 
 * @param year 年
 * @param month 月
 * @param day 日
 * @param tar 是否使用压缩格式返回
 */
export function donwloadBillSuccess(year: number, month: number, day: number, tar?: boolean): Promise<TradeCsvResponseModel<TradeBillSummaryInfo, TradeBillSuccessInfo>> {
    return download(TradeBillSuccessAction, new TradeBillSuccessModel(year, month, day, tar));
}

/**
 * 下载所有退款的交易数据
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 * 
 * @param year 年
 * @param month 月
 * @param day 日
 * @param tar 是否使用压缩格式返回
 */
export function downloadBillRefund(year: number, month: number, day: number, tar?: boolean): Promise<TradeCsvResponseModel<TradeBillSummaryInfo, TradeBillRefundInfo>> {
    return download(TradeBillRefundAction, new TradeBillRefundModel(year, month, day, tar));
}

/**
 * 下载基本账户资金账单
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 * 
 * @param year 年
 * @param month 月
 * @param day 日
 * @param tar 是否使用压缩格式返回
 */
export function downloadBasicFundflow(year: number, month: number, day: number, tar?: boolean): Promise<TradeCsvResponseModel<TradeFundflowSummaryInfo, TradeFundflowInfo>> {
    return download(TradeFundflowAction, new TradeFundflowModel(year, month, day, AccountTypeEnum.BASIC, tar));
}

/**
 * 下载手续费账户资金账单
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 * 
 * @param year 年
 * @param month 月
 * @param day 日
 * @param tar 是否使用压缩格式返回
 */
export function downloadFeesFundflow(year: number, month: number, day: number, tar?: boolean): Promise<TradeCsvResponseModel<TradeFundflowSummaryInfo, TradeFundflowInfo>> {
    return download(TradeFundflowAction, new TradeFundflowModel(year, month, day, AccountTypeEnum.FEES, tar));
}

/**
 * 下载运营账户资金账单
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 * 
 * @param year 年
 * @param month 月
 * @param day 日
 * @param tar 是否使用压缩格式返回
 */
export function downloadOperationFundflow(year: number, month: number, day: number, tar?: boolean): Promise<TradeCsvResponseModel<TradeFundflowSummaryInfo, TradeFundflowInfo>> {
    return download(TradeFundflowAction, new TradeFundflowModel(year, month, day, AccountTypeEnum.OPERATION, tar));
}

/**
 * 解析支付结果通知消息
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 * 
 * @param xml 微信回调的XML字符串
 */
export function onPayNotified(xml: string): TradeCreateNotifyModel | undefined {
    let values = fetchValues(xml);
    checkReturn(values);
    return fromXmlResponse(values, TradeCreateNotify);
}

/**
 * 解析退款结果通知消息
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 * 
 * @param xml 微信回调的XML字符串
 */
export function onRefundNotified(xml: string): TradeRefundNotifyModel | undefined {
    let values = fetchValues(xml);
    checkReturn(values);
    return fromXmlResponse(values, TradeRefundNotify);
}