import 'reflect-metadata';
import { plainToClass, classToPlain } from 'class-transformer';
import { CSVParseParam } from 'csvtojson/v2/Parameters';
import { parse as toJson, j2xParser as toXml } from 'fast-xml-parser';
import { Readable } from 'stream';
import { resolve } from 'path';
import { customAlphabet } from 'nanoid';
import { TreeMap, Collections } from 'typescriptcollectionsframework';
import nconf from 'nconf';
import crypto from 'crypto';
import csv from 'csvtojson';
import he from "he";
import hmacSha256 from 'crypto-js/hmac-sha256';
import md5 from 'crypto-js/md5';
import https from 'https';
import { TradeResponse, TradeAction } from './actions/TradeAction';
import { TradeCreateModel, TradeCreateResponseModel, TradeCreateNotifyModel } from './models/TradeCreateModels';
import { TradeCreateAction, TradeQueryAction, TradeCloseAction, TradeRefundAction, TradeRefundQueryAction } from './actions/TradeActions';
import { TradeQueryResponseModel } from './models/TradeQueryModels';
import { TradeCloseResponseModel } from './models/TradeCloseModels';
import { TradeRefundModel, TradeRefundResponseModel, TradeRefundNotifyModel } from './models/TradeRefundModels';
import { TradeRefundQueryModel, TradeRefundQueryResponseModel } from './models/TradeRefundQueryModels';
import { TradeCreateNotify, TradeRefundNotify } from './actions/NotifyActions';
import { TradeBillAllAction, TradeBillSuccessAction, TradeBillRefundAction, TradeFundflowAction } from './actions/SheetActions';
import { CsvResponse, TradeBillAllModel, TradeBillAllResponseModel, TradeBillSuccessModel, TradeBillSuccessResponseModel, TradeBillRefundModel, TradeBillRefundResponseModel, TradeFundflowModel, TradeFundflowResponseModel } from './models/TradeSheetModels';
import { TradeReturnModel, TradeResultModel, API_ERROR_MESSAGES, XmlModel, TradeNoModel } from './models/TradeCommons';
import { SignTypeEnum } from './enums/SignTypeEnum';
import { ErrorCodeEnum } from './enums/ErrorCodeEnum';

nconf.file(resolve('./wechat.config.json'));
const nanoid = customAlphabet('1234567890abcdef', 32);

class Executor<R, S> {
    private action: TradeAction<R, S>;
    private model?: R;
    constructor(action: TradeAction<R, S>) {
        this.action = action;
    }

    public withModel(model: R): Executor<R, S> {
        this.model = model;
        return this;
    }

    public execute(): S {
        if (this.model == undefined) {
            throw Error("Model Object must not be null");
        }

        // const httsAgent = new https.Agent({ rejectUnauthorized: false });

        let forPost = toRequestXml(this.model);
        console.log(forPost);
        console.log(this.action);

        return parseXmlResponse('xml', this.action);
    }
}

export function newCreateAction(): Executor<TradeCreateModel, TradeCreateResponseModel> {
    return new Executor(TradeCreateAction);
}

export function newQueryAction(): Executor<TradeNoModel, TradeQueryResponseModel> {
    return new Executor(TradeQueryAction);
}

export function newCloseAction(): Executor<TradeNoModel, TradeCloseResponseModel> {
    return new Executor(TradeCloseAction);
}

export function newRefundAction(): Executor<TradeRefundModel, TradeRefundResponseModel> {
    return new Executor(TradeRefundAction);
}

export function newRefundQueryAction(): Executor<TradeRefundQueryModel, TradeRefundQueryResponseModel> {
    return new Executor(TradeRefundQueryAction);
}

export function newBillAllAction(): Executor<TradeBillAllModel, TradeBillAllResponseModel> {
    return new Executor(TradeBillAllAction);
}

export function newBillSuccessAction(): Executor<TradeBillSuccessModel, TradeBillSuccessResponseModel> {
    return new Executor(TradeBillSuccessAction);
}

export function newBillRefundAction(): Executor<TradeBillRefundModel, TradeBillRefundResponseModel> {
    return new Executor(TradeBillRefundAction);
}

export function newFundflowAction(): Executor<TradeFundflowModel, TradeFundflowResponseModel> {
    return new Executor(TradeFundflowAction);
}

export function onCreateNotifier(xml: string): TradeCreateNotifyModel {
    return parseXmlResponse(xml, TradeCreateNotify);
}

export function onRefundNotifier(xml: string): TradeRefundNotifyModel {
    return parseXmlResponse(xml, TradeRefundNotify);
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


function parseXmlResponse<T>(xml: string, resultType: TradeResponse<T>): T {
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

    if (resultType.hasSigned && sign(values, resultType.responseSignType) != values['sign']) {
        throw new WechatApiError(ErrorCodeEnum.SIGNERROR, API_ERROR_MESSAGES[ErrorCodeEnum.SIGNERROR]);
    }

    if (resultType.encrypted != undefined) {
        values = { ...values, ...decrypt(values[resultType.encrypted], nconf.get('mch_key')) };
        delete values[resultType.encrypted];
    }

    if (resultType.hasHierarchy && resultType.responseType != undefined) {
        values = hierarchy(resultType.responseType, values);
    }

    return plainToClass(resultType.responseType, values);
}

async function parseCsvResponse<ST, RT>(readStream: Readable,
    resultType: { new(...args: any[]): CsvResponse<ST, RT>; }): Promise<CsvResponse<ST, RT>> {

    let hasChineseWord = (text: string): boolean => /.*[\u4e00-\u9fa5]+.*/.test(text);
    let csvParam: Partial<CSVParseParam> = { noheader: true, output: "json", delimiter: ',', ignoreEmpty: true, nullObject: true };
    let summary: string = '';
    let isSummary: boolean = false;
    let result = new resultType();

    await csv({ ...csvParam, headers: Reflect.getMetadata('columns', result.recordType()) })
        .fromStream(readStream)
        .preFileLine((line, index) => {
            if (isSummary) { summary = line; return ','; }
            let traw = line.replace(/`/g, "");

            if (hasChineseWord(traw.substr(0, 1))) {
                traw = ',';
                if (index > 0 && !isSummary) { isSummary = true; }
            }
            return traw;
        })
        .then((csvRow: any[]) => {
            for (var i = 0; i < csvRow.length; i++) {
                result.records.push(plainToClass(result.recordType(), csvRow[i]))
            }
        });

    await csv({ ...csvParam, headers: Reflect.getMetadata('columns', result.summaryType()) })
        .fromString(summary)
        .preFileLine((line, _index) => line.replace(/`/g, ""))
        .then((csvRow: any[]) => {
            result.summary = plainToClass(result.summaryType(), csvRow[0]);
        });

    return result;
}

function sign(forSign: any, signType: SignTypeEnum | undefined = SignTypeEnum.MD5): string | undefined {
    var sorted = new TreeMap<string, any>(Collections.getStringComparator());
    for (let prop in forSign) {
        if (forSign[prop] != undefined && prop != 'sign') {
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
