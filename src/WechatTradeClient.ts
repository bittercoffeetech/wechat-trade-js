import 'reflect-metadata';
import { plainToClass, classToPlain } from 'class-transformer';
import { CSVParseParam } from 'csvtojson/v2/Parameters';
import { parse as toJson, j2xParser as toXml } from 'fast-xml-parser';
import { Readable, Duplex } from 'stream';
import { resolve } from 'path';
import { customAlphabet } from 'nanoid';
import { TreeMap, Collections } from 'typescriptcollectionsframework';
import nconf from 'nconf';
import crypto from 'crypto';
import csv from 'csvtojson';
import he from "he";
import hmacSha256 from 'crypto-js/hmac-sha256';
import md5 from 'crypto-js/md5';
import zlib from 'zlib';
// import https from 'https';
import axios from 'axios';
import { TradeResponse, TradeAction, TradeCsvResponse, TradeCsvAction } from './actions/TradeAction';
import { TradeCreateModel, TradeCreateResponseModel, TradeCreateNotifyModel } from './models/TradeCreateModels';
import { TradeCreateAction, TradeQueryAction, TradeCloseAction, TradeRefundAction, TradeRefundQueryAction } from './actions/TradeActions';
import { TradeQueryResponseModel } from './models/TradeQueryModels';
import { TradeEmptyResponseModel } from './models/TradeCloseModels';
import { TradeRefundModel, TradeRefundResponseModel, TradeRefundNotifyModel } from './models/TradeRefundModels';
import { TradeRefundQueryModel, TradeRefundQueryResponseModel } from './models/TradeRefundQueryModels';
import { TradeCreateNotify, TradeRefundNotify } from './actions/NotifyActions';
import { TradeBillAllAction, TradeBillSuccessAction, TradeBillRefundAction, TradeFundflowAction } from './actions/SheetActions';
import { TradeBillAllModel, TradeBillSuccessModel, TradeBillRefundModel, TradeFundflowModel, TradeCsvResponseModel, TradeBillSummaryInfo, TradeBillAllInfo } from './models/TradeSheetModels';
import { TradeReturnModel, TradeResultModel, API_ERROR_MESSAGES, XmlModel, TradeNoModel } from './models/TradeCommons';
import { SignTypeEnum } from './enums/SignTypeEnum';
import { ErrorCodeEnum } from './enums/ErrorCodeEnum';

nconf.file(resolve('./wechat.config.json'));
const nanoid = customAlphabet('1234567890abcdef', 32);

class Executor<R, S> {
    private action: TradeAction<R, S>;
    private model: R;
    constructor(action: TradeAction<R, S>, model: R) {
        this.model = model;
        this.action = action;
    }

    public async execute(): Promise<S | undefined> {
        
        if (this.model == undefined) {
            throw Error("Model Object must not be null");
        }

        // const httsAgent = new https.Agent({ rejectUnauthorized: false });

        let forPost = toRequestXml(this.model);
        console.log(forPost);
        let forResult: S | undefined = undefined;

        await axios.post(this.action.url, forPost, {
            responseType: 'arraybuffer'
        }).then((resp) => {

            if(!this.action.isStreaming) {
                return parseXmlResponse(resp.data, this.action);
            }
            // } else {
            //     let stream = new Duplex();
            //     stream.push(zlib.unzipSync(resp.data));
            //     stream.push(null);

 
            //     parseCsvResponse(stream, this.action as TradeCsvAction<R, ?, ?>).then((r) => {
            //             console.log(r);
            //     });

            // }

            return undefined;
            
        }).catch((e) => {
            throw e;
        });
        
        return forResult;
        //parseCsvResponse(require('fs').createReadStream(resolve('./__tests__/data/refund.txt')), TradeBillAllResponseModel);
      
    }
}


function toRequestXml(request: any): string {
    let forSign = {
        ...classToPlain(request),
        ...{
            'appid': nconf.get('appid'),
            'mch_id': nconf.get('mch_id'),
            'nonce_str': nanoid()
        }
    };
    forSign["sign"] = sign(forSign);

    return new toXml({
        format: true,
        tagValueProcessor: (value: string) => '<![CDATA[' + he.escape(value.toString()) + ']]>'
    }).parse({ xml: forSign }).toString();
}


function parseXmlResponse<T>(xml: string, response: TradeResponse<T>): T | undefined{
    let values = toJson(xml, { parseTrueNumberOnly: true })["xml"];

    let returnModel = plainToClass(TradeReturnModel, values,
        { excludeExtraneousValues: true });
    if (!returnModel.isSuccess) {
        throw new WechatApiError(returnModel.returnCode, returnModel.returnMessage);
    }
    let resultModel = plainToClass(TradeResultModel, values,
        { excludeExtraneousValues: true });
    if (!resultModel.isSuccess) {
        throw new WechatApiError(resultModel.errorCode, resultModel.errorMessage);
    }
    
    if(response.responseType != undefined) {
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
    } else {
        return undefined;
    }
    
}

async function parseCsvResponse<ST, RT>(readStream: Readable, responseType: TradeCsvResponse<ST, RT>): Promise<TradeCsvResponseModel<ST, RT>> {

    let hasChineseWord = (text: string): boolean => /.*[\u4e00-\u9fa5]+.*/.test(text);
    let csvParam: Partial<CSVParseParam> = { noheader: true, output: "json", delimiter: ',', ignoreEmpty: true, nullObject: true };
    let summaryLine: string = '';
    let isSummary: boolean = false;
    let result = new TradeCsvResponseModel<ST, RT>();

    await csv({ ...csvParam, headers: Reflect.getMetadata('columns', responseType.recordType() ) })
        .fromStream(readStream)
        .preFileLine((line, index) => {
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
                result.records.push(plainToClass(responseType.recordType(), csvRow[i], {enableImplicitConversion: true}))
            }
        });

    await csv({ ...csvParam, headers: Reflect.getMetadata('columns', responseType.summaryType()) })
        .fromString(summaryLine)
        .preFileLine((line, _index) => line.replace(/`/g, ""))
        .then((csvRow: any[]) => {
            result.summary = plainToClass(responseType.summaryType(), csvRow[0], {enableImplicitConversion: true});
        });

    return result;
}

function sign(forSign: any, signType: SignTypeEnum | undefined = SignTypeEnum.MD5): string | undefined {
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

    if (SignTypeEnum.MD5 == signType || signType == undefined) {
        return md5(params.join("&")).toString().toUpperCase();
    }
    else if (SignTypeEnum.HMAC_SHA256 == signType) {
        return hmacSha256(params.join("&")).toString().toUpperCase();
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

export class WechatApiError extends Error {
    code: string;
    constructor(code: string, message?: string) {
        super(message);
        this.code = code;
    }
}


export function newCreateAction(model: TradeCreateModel): Executor<TradeCreateModel, TradeCreateResponseModel> {
    return new Executor(TradeCreateAction, model);
}

export function newQueryAction(model: TradeNoModel): Executor<TradeNoModel, TradeQueryResponseModel> {
    return new Executor(TradeQueryAction, model);
}

export function newCloseAction(model: TradeNoModel): Executor<TradeNoModel, TradeEmptyResponseModel> {
    return new Executor(TradeCloseAction, model);
}

export function newRefundAction(model: TradeRefundModel): Executor<TradeRefundModel, TradeRefundResponseModel> {
    return new Executor(TradeRefundAction, model);
}

export function newRefundQueryAction(model: TradeRefundQueryModel): Executor<TradeRefundQueryModel, TradeRefundQueryResponseModel> {
    return new Executor(TradeRefundQueryAction, model);
}

export function newBillAllAction(model: TradeBillAllModel): Executor<TradeBillAllModel, TradeCsvResponseModel<TradeBillSummaryInfo, TradeBillAllInfo>> {
    return new Executor(TradeBillAllAction, model);
}

export function newBillSuccessAction(model: TradeBillSuccessModel): Executor<TradeBillSuccessModel, TradeBillSuccessResponseModel> {
    return new Executor(TradeBillSuccessAction, model);
}

export function newBillRefundAction(model: TradeBillRefundModel): Executor<TradeBillRefundModel, TradeBillRefundResponseModel> {
    return new Executor(TradeBillRefundAction, model);
}

export function newFundflowAction(model: TradeFundflowModel): Executor<TradeFundflowModel, TradeFundflowResponseModel> {
    return new Executor(TradeFundflowAction, model);
}

export function onCreateNotifier(xml: string): TradeCreateNotifyModel {
    return parseXmlResponse(xml, TradeCreateNotify);
}

export function onRefundNotifier(xml: string): TradeRefundNotifyModel {
    return parseXmlResponse(xml, TradeRefundNotify);
}