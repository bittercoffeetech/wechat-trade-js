import { plainToClass } from 'class-transformer';
import * as crypto from 'crypto';
import csv from 'csvtojson';
import { CSVParseParam } from 'csvtojson/v2/Parameters';
import { parse as toJson } from 'fast-xml-parser';
import internal from 'stream';

import { XmlModel } from './decorators';
import { CsvResponse } from './models/TradeSheetModels';

export function decrypt(content: string, key: string): object {
    let encKey = crypto.createHash("md5").update(key, 'utf8').digest('hex');
    let decipher: crypto.Decipher = crypto.createDecipheriv('aes-256-ecb', encKey, '');
    decipher.setAutoPadding(true);
    let chunks = [];
    chunks.push(decipher.update(content, 'base64', 'utf8'));
    chunks.push(decipher.final('utf8'));

    return toJson(chunks.join(''), { parseTrueNumberOnly: true })["root"];
}

export function hierarchy(model: new (...args: any[]) => any, source: object): object {
    let result = {};
    morphValues(model, source, result, []);
    clearValues(source);

    return { ...source, ...result };
}

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

    Reflect.getMetadataKeys(model).forEach((key : string) => {
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

export async function parseCsvResponse<ST, RT>(readStream: internal.Readable,
    resultType: { new(...args: any[]): CsvResponse<ST, RT>; }): Promise<CsvResponse<ST, RT>> {

    let hasChineseWord = (text: string): boolean => /.*[\u4e00-\u9fa5]+.*/.test(text);
    let csvParam : Partial<CSVParseParam> = {noheader: true, output: "json", delimiter: ',', ignoreEmpty: true, nullObject: true};
    let summary: string = '';
    let isSummary: boolean = false;
    let result = new resultType();

    await csv({...csvParam, headers: Reflect.getMetadata('columns', result.recordType())})
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

    await csv({...csvParam, headers: Reflect.getMetadata('columns', result.summaryType())})
        .fromString(summary)
        .preFileLine((line, _index) => line.replace(/`/g, ""))
        .then((csvRow: any[]) => {
            result.summary = plainToClass(result.summaryType(), csvRow[0]);
        });

    return result;
}