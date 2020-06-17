import * as crypto from 'crypto';
import { parse as toJson } from 'fast-xml-parser';
import { ApiField } from './decorators';
import internal from 'stream';
import { CsvResponse } from './models/TradeSheetModels';
import { plainToClass } from 'class-transformer';
import csv from 'csvtojson';

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

    Reflect.getMetadataKeys(model).forEach((key) => {
        let apiField = Reflect.getMetadata(key, model) as ApiField;
        let propName = apiField.name + suffix;

        if (apiField.subType == undefined) {
            let propValue = source[propName];

            if (propValue != undefined) {
                result[apiField.name] = propValue;
            }
        } else {
            let count: number = source[apiField.countName + suffix] as number;

            if (count > 0) {
                let subObjects = [];
                for (let i = 0; i < count; i++) {
                    let subObject = {};
                    morphValues(apiField.subType, source, subObject, levels.concat(i));
                    subObjects.push(subObject);
                }
                result[apiField.name] = subObjects;
            }
        }
    });
}

export async function CsvResponseParser<ST, RT>(readStream: internal.Readable, 
    summaryType: { new(...args: any[]): ST; }, 
    recordType: { new(...args: any[]): RT; }) : Promise<CsvResponse<ST, RT>> {
    
    let hasChineseWord = (text: string): boolean => {
        return /.*[\u4e00-\u9fa5]+.*/.test(text);
    }
    let summary: string = '';
    let isSummary: boolean = false;
    let result = new CsvResponse<ST, RT>();

    await csv({
        noheader: true,
        output: "json",
        delimiter: ',',
        ignoreEmpty: true,
        nullObject: true,
        headers: Reflect.getMetadata('columns', recordType)
    })
    .fromStream(readStream)
    .preFileLine((line, index) => {
        if (isSummary) {
            summary = line;
            return ',';
        }
        let traw = line.replace(/`/g, "");

        if (hasChineseWord(traw.substr(0, 1))) {
            traw = ',';
            if (index > 0 && !isSummary) {
                isSummary = true;
            }
        }
        return traw;
    })
    .then((csvRow: any[]) => {
        for (var i = 0; i < csvRow.length; i++) {
            result.records.push(plainToClass(recordType, csvRow[i]))
        }
    });

    await csv({
        noheader: true,
        output: "json",
        delimiter: ',',
        ignoreEmpty: true,
        nullObject: true,
        headers: Reflect.getMetadata('columns', summaryType)
    }).fromString(summary)
    .preFileLine((line, _index) => line.replace(/`/g, ""))
    .then((csvRow: any[]) => {
        result.summary = plainToClass(summaryType, csvRow[0]);
    });

    return result;
}