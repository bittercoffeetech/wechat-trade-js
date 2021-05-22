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

import { TradeAction } from './actions/TradeAction';
import { TradeBillAllAction } from './actions/TradeBillAllAction';
import { TradeBillRefundAction } from './actions/TradeBillRefundAction';
import { TradeBillSuccessAction } from './actions/TradeBillSuccessAction';
import { TradeCloseAction } from './actions/TradeCloseAction';
import { TradeCreateAction } from './actions/TradeCreateAction';
import { TradeCreateNotifyAction } from './actions/TradeCreateNotifyAction';
import { TradeFundflowAction } from './actions/TradeFundflowAction';
import { TradeQueryAction } from './actions/TradeQueryAction';
import { TradeRefundAction } from './actions/TradeRefundAction';
import { TradeRefundNotifyAction } from './actions/TradeRefundNotifyAction';
import { TradeRefundQueryAction } from './actions/TradeRefundQueryAction';
import { TradeResponse } from './actions/TradeResponse';
import { TradeSheetAction } from './actions/TradeSheetAction';
import { TradeSheetResponse } from './actions/TradeSheetResponse';
import { XmlPropertyModel } from './decorators/XmlProperty';
import { AccountTypeEnum } from './enums/AccountTypeEnum';
import { ErrorCodeEnum } from './enums/ErrorCodeEnum';
import { SignTypeEnum } from './enums/SignTypeEnum';
import { TradeBillAllInfo } from './models/TradeBillAllInfo';
import { TradeBillAllRequest } from './models/TradeBillAllRequest';
import { TradeBillRefundInfo } from './models/TradeBillRefundInfo';
import { TradeBillRefundRequest } from './models/TradeBillRefundRequest';
import { TradeBillSuccessInfo } from './models/TradeBillSuccessInfo';
import { TradeBillSuccessRequest } from './models/TradeBillSuccessRequest';
import { TradeBillSummaryInfo } from './models/TradeBillSummaryInfo';
import { TradeCreateNotify } from './models/TradeCreateNotify';
import { TradeCreateRequest } from './models/TradeCreateRequest';
import { TradeCreateResponse } from './models/TradeCreateResponse';
import { TradeDownloadRequest } from './models/TradeDownloadRequest';
import { TradeDownloadResponse } from './models/TradeDownloadResponse';
import { TradeFundflowInfo } from './models/TradeFundflowInfo';
import { TradeFundflowRequest } from './models/TradeFundflowRequest';
import { TradeFundflowSummaryInfo } from './models/TradeFundflowSummaryInfo';
import { TradeNoInfo } from './models/TradeNoInfo';
import { TradeQueryResponse } from './models/TradeQueryResponse';
import { TradeRefundNotify } from './models/TradeRefundNotify';
import { TradeRefundQueryRequest } from './models/TradeRefundQueryRequest';
import { TradeRefundQueryResponse } from './models/TradeRefundQueryResponse';
import { TradeRefundRequest } from './models/TradeRefundRequest';
import { TradeRefundResponse } from './models/TradeRefundResponse';
import { TradeResultInfo } from './models/TradeResultInfo';
import { TradeReturnInfo } from './models/TradeReturnInfo';
import { WechatApiError, WechatApiErrorMessages } from './WechatApiError';

nconf.file(resolve('./wechat.config.json'));
const nanoid = customAlphabet('1234567890abcdef', 32);
const axiosClient = axios.create();

async function execute<R, S>(action: TradeAction<R, S>, model: R): Promise<S | undefined> {
    if (!model) {
        throw Error("Model Object must not be null");
    }

    let forPost = toRequestBody(model, action.requestSignType);
    let forResult: S | undefined = undefined;
    var httpsAgent;

    if (action.certificated) {
        httpsAgent = new https.Agent({
            pfx: fs.readFileSync(resolve(nconf.get('api_cert'))),
            maxVersion: 'TLSv1.2',
            passphrase: nconf.get('mch_id')
        });
    }

    await axiosClient.post(action.url, forPost, {
        responseType: 'text',
        httpsAgent: httpsAgent
    }).then((resp: AxiosResponse<string>) => {
        let values = fetchValues(resp.data);
        checkReturn(values);
        forResult = fromXmlResponse(values, action);
    }).catch((error: WechatApiError) => {
        if(error instanceof WechatApiError) {
            throw error;
        } else {
            throw new WechatApiError('SYSTEMERROR', error);
        }        
    });

    return forResult;
}

async function download<R extends TradeDownloadRequest, ST, RT>(action: TradeSheetAction<R, ST, RT>, model: R): Promise<TradeDownloadResponse<ST, RT>> {
    if (!model) {
        throw Error("Model Object must not be null");
    }

    let forPost = toRequestBody(model, action.requestSignType);
    let forResult = new TradeDownloadResponse<ST, RT>();
    var httpsAgent;

    if (action.certificated) {
        httpsAgent = new https.Agent({
            pfx: fs.readFileSync(resolve(nconf.get('api_cert'))),
            maxVersion: 'TLSv1.2',
            passphrase: nconf.get('mch_id')
        });
    }

    await axiosClient.post(action.url, forPost, {
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
    }).catch((error: WechatApiError) => {
        if(error instanceof WechatApiError) {
            throw error;
        } else {
            throw new WechatApiError('SYSTEMERROR', error);
        }    
    });

    return forResult;
}

const toRequestBody = (request: {}, signType: SignTypeEnum = SignTypeEnum.MD5): string => {
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

const fetchValues = (xml: string): {} => toJson(xml, { parseTrueNumberOnly: true })["xml"];
const checkReturn = (values: {}): void => {
    let returnModel = plainToClass(TradeReturnInfo, values,
        { excludeExtraneousValues: true });
    if (!returnModel.isSuccess) {
        throw new WechatApiError(returnModel.errorCode, returnModel.errorMessage);
    }
}
const checkResult = (values: {}): void => {
    let resultModel = plainToClass(TradeResultInfo, values,
        { excludeExtraneousValues: true });
    if (!resultModel.isSuccess) {
        throw new WechatApiError(resultModel.errorCode, resultModel.errorMessage);
    }
}

function fromXmlResponse<T>(values: {}, response: TradeResponse<T>): T {
    if (response.hasResult) {
        checkResult(values);
    }

    if (response.responseType) {        
        if (response.hasSigned && sign(values, response.responseSignType) != values['sign']) {
            throw new WechatApiError(ErrorCodeEnum.SIGNERROR, WechatApiErrorMessages[ErrorCodeEnum.SIGNERROR]);
        }
        if (response.encrypted) {
            values = { ...values, ...decrypt(values[response.encrypted], nconf.get('mch_key')) };
            delete values[response.encrypted];
        }
        if (response.hasHierarchy && response.responseType) {
            values = hierarchy(response.responseType, values);
        }
        return plainToClass(response.responseType, values, { enableImplicitConversion: true, excludeExtraneousValues: true });
    } else {
        return {} as T;
    }
}

async function fromCsvResponse<ST, RT>(csvData: string, response: TradeSheetResponse<ST, RT>): Promise<TradeDownloadResponse<ST, RT>> {
    let hasChineseWord = (text: string): boolean => /.*[\u4e00-\u9fa5]+.*/.test(text);
    let csvParam: Partial<CSVParseParam> = { noheader: true, output: "json", delimiter: ',', ignoreEmpty: true, nullObject: true };
    let summaryLine: string = '', isSummary: boolean = false;
    let result = new TradeDownloadResponse<ST, RT>();

    await csv({ ...csvParam, headers: Reflect.getMetadata('columns', response.recordType) })
        .fromString(csvData)
        .preFileLine((line: string, index: number) => {
            if (isSummary) { summaryLine = line; return ','; }
            let raw = line.replace(/`/g, "");

            if (hasChineseWord(raw.substr(0, 1))) {
                raw = ',';
                if (index > 0 && !isSummary) { isSummary = true; }
            }
            return raw;
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

const sign = (forSign: {}, signType: SignTypeEnum = SignTypeEnum.MD5): string => {
    var sorted = new TreeMap<string, any>(Collections.getStringComparator());
    for (let prop in forSign) {
        if (forSign[prop] && forSign[prop] != '' && prop != 'sign') {
            sorted.put(prop, forSign[prop]);
        }
    }

    let params = [];
    let entities = sorted.entrySet().iterator();
    while (entities.hasNext()) {
        let entity = entities.next();
        params.push(entity.getKey() + "=" + entity.getValue());
    }
    params.push("key=" + nconf.get('mch_key'));
    let signString = params.join("&");

    if (SignTypeEnum.MD5 == signType) {
        return md5(signString).toString().toUpperCase();
    } else if (SignTypeEnum.HMAC_SHA256 == signType) {
        return hmacSha256(signString, nconf.get('mch_key')).toString().toUpperCase();
    } else {
        return '';
    }
}

const decrypt = (content: string, key: string): object => {
    let chunks = [];
    let encKey = crypto.createHash("md5").update(key, 'utf8').digest('hex');
    let decipher: crypto.Decipher = crypto.createDecipheriv('aes-256-ecb', encKey, '');

    decipher.setAutoPadding(true);
    chunks.push(decipher.update(content, 'base64', 'utf8'));
    chunks.push(decipher.final('utf8'));

    return toJson(chunks.join(''), { parseTrueNumberOnly: true })["root"];
}

const hierarchy = (model: new (...args: any[]) => any, source: object): object => {
    let result = {};

    merge(model, source, result, []);
    clear(source);

    return { ...source, ...result };

    function clear(source: object) {
        for (const key of Object.keys(source)) {
            let matched = key.match('.*(_)[0-9]+$');
            if (matched != null && matched.length > 0) {
                delete source[key];
            }
        }
    }

    function merge(model: new (...args: any[]) => any, source: object, result: object, levels: number[]): void {
        let suffix: string = levels.length == 0 ? '' : "_" + levels.join("_");

        Reflect.getMetadataKeys(model).forEach((key: string) => {
            let xmlModel = Reflect.getMetadata(key, model) as XmlPropertyModel;
            let propName = xmlModel.name + suffix;

            if(xmlModel.subType) {
                let count: number = source[xmlModel.countName + suffix] as number;

                if (count > 0) {
                    let childs = [];
                    for (let i = 0; i < count; i++) {
                        let child = {};
                        merge(xmlModel.subType, source, child, levels.concat(i));
                        childs.push(child);
                    }
                    result[xmlModel.name] = childs;
                }
            } else {
                let propValue = source[propName];

                if (propValue != undefined) {
                    result[xmlModel.name] = propValue;
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
export function createTrade(model: TradeCreateRequest): Promise<TradeCreateResponse | undefined> {
    return execute(TradeCreateAction, model);
}

/**
 * 订单查询
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 */
export function queryTrade(model: TradeNoInfo): Promise<TradeQueryResponse | undefined> {
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
export function closeTrade(model: TradeNoInfo): Promise<undefined> {
    return execute(TradeCloseAction, model);
}

/**
 * 发起退款
 * 
 * @since 1.0
 * @async
 * @author BitterCoffee
 */
export function createRefund(model: TradeRefundRequest): Promise<TradeRefundResponse | undefined> {
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
export function queryRefund(model: TradeRefundQueryRequest): Promise<TradeRefundQueryResponse | undefined> {
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
export function downloadAllBill(year: number, month: number, day: number, tar?: boolean): Promise<TradeDownloadResponse<TradeBillSummaryInfo, TradeBillAllInfo>> {
    return download(TradeBillAllAction, new TradeBillAllRequest(year, month, day, tar));
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
export function donwloadSuccessBill(year: number, month: number, day: number, tar?: boolean): Promise<TradeDownloadResponse<TradeBillSummaryInfo, TradeBillSuccessInfo>> {
    return download(TradeBillSuccessAction, new TradeBillSuccessRequest(year, month, day, tar));
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
export function downloadRefundBill(year: number, month: number, day: number, tar?: boolean): Promise<TradeDownloadResponse<TradeBillSummaryInfo, TradeBillRefundInfo>> {
    return download(TradeBillRefundAction, new TradeBillRefundRequest(year, month, day, tar));
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
export function downloadBasicFundflow(year: number, month: number, day: number, tar?: boolean): Promise<TradeDownloadResponse<TradeFundflowSummaryInfo, TradeFundflowInfo>> {
    return download(TradeFundflowAction, new TradeFundflowRequest(year, month, day, AccountTypeEnum.BASIC, tar));
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
export function downloadFeesFundflow(year: number, month: number, day: number, tar?: boolean): Promise<TradeDownloadResponse<TradeFundflowSummaryInfo, TradeFundflowInfo>> {
    return download(TradeFundflowAction, new TradeFundflowRequest(year, month, day, AccountTypeEnum.FEES, tar));
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
export function downloadOperationFundflow(year: number, month: number, day: number, tar?: boolean): Promise<TradeDownloadResponse<TradeFundflowSummaryInfo, TradeFundflowInfo>> {
    return download(TradeFundflowAction, new TradeFundflowRequest(year, month, day, AccountTypeEnum.OPERATION, tar));
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
export function onPayNotified(xml: string): TradeCreateNotify | undefined {
    let values = fetchValues(xml);
    checkReturn(values);
    return fromXmlResponse(values, TradeCreateNotifyAction);
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
export function onRefundNotified(xml: string): TradeRefundNotify | undefined {
    let values = fetchValues(xml);
    checkReturn(values);
    return fromXmlResponse(values, TradeRefundNotifyAction);
}