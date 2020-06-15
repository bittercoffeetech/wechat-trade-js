import * as crypto from 'crypto';
import { parse as toJson } from 'fast-xml-parser';

export function decrypt(content: string, key: string): object {
    let encKey = crypto.createHash("md5").update(key, 'utf8').digest('hex');
    let decipher: crypto.Decipher = crypto.createDecipheriv('aes-256-ecb', encKey, '');
    decipher.setAutoPadding(true);
    let cipherChunks = [];
    cipherChunks.push(decipher.update(content, 'base64', 'utf8'));
    cipherChunks.push(decipher.final('utf8'));

    return toJson(cipherChunks.join(''), { parseTrueNumberOnly: true })["root"];
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