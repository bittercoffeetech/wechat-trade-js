import 'reflect-metadata';
import { plainToClass, classToPlain } from 'class-transformer';
import { CSVParseParam } from 'csvtojson/v2/Parameters';
import { parse as toJson, j2xParser as toXml } from 'fast-xml-parser';
import { Readable } from 'stream';
import { resolve } from 'path';
import { CsvResponse } from './models/TradeSheetModels';
import { TradeReturnModel, TradeResultModel, ERRORS, XmlModel } from './models/TradeCommons';
import { ErrorCodeEnum } from './enums/ErrorCodeEnum';
import { customAlphabet } from 'nanoid';
import { SignTypeEnum } from './enums/SignTypeEnum';
import { TreeMap, Collections } from 'typescriptcollectionsframework';
import nconf from 'nconf';
import crypto from 'crypto';
import csv from 'csvtojson';
import he from "he";
import hmacSha256 from 'crypto-js/hmac-sha256';
import md5 from 'crypto-js/md5';

nconf.file(resolve('./wechat.config.json'));
const nanoid = customAlphabet('1234567890abcdef', 32);

function toRequestXml(request: any,): string {
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


function parseXmlResponse<T>(xml: string, resultType: TradeResponse<T>) {
    let values = toJson(xml, { parseTrueNumberOnly: true })["xml"];

    let returnModel = plainToClass(TradeReturnModel, values);
    if (!returnModel.isSuccess) {
        throw new WechatApiError(returnModel.returnCode, returnModel.returnMessage);
    }

    let resultModel = plainToClass(TradeResultModel, values);
    if (!resultModel.isSuccess) {
        throw new WechatApiError(resultModel.errorCode, resultModel.errorMessage);
    }

    if (resultType.hasSigned && sign(values, resultType.responseSignType) != values['sign']) {
        throw new WechatApiError(ErrorCodeEnum.SIGNERROR, ERRORS[ErrorCodeEnum.SIGNERROR]);
    }

    if (resultType.encrypted != undefined) {
        values = { ...values, ...decrypt(values[resultType.encrypted], nconf.get('mch_key')) };
        delete values[resultType.encrypted];
    }

    if (resultType.hasHierarchy && resultType.responseType != undefined) {
        values = hierarchy(resultType.responseType, values);
    }

    if (resultType.responseType != undefined) {
        return plainToClass(resultType.responseType, values);
    } else {
        return undefined;
    }

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
