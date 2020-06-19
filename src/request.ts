import { j2xParser as toXml } from 'fast-xml-parser';
import { classToPlain, plainToClass } from 'class-transformer';
import md5 from 'crypto-js/md5';
import { TreeMap, Collections } from "typescriptcollectionsframework";
import { customAlphabet } from 'nanoid';
import nconf from "nconf";
import { resolve } from "path";

const nanoid = customAlphabet('1234567890abcdef', 32);
nconf.file(resolve('./wechat.config.json'));

export function toRequestXml(request: any) : string {
    let forSign = {...classToPlain(request), ...{
        'appid': nconf.get('appid'),
        'mch_id': nconf.get('mch_id'),
        'nonce_str' : '05381462014616644751868586145240' //nanoid()
    }};
    var sorted = new TreeMap<string, any>(Collections.getStringComparator());
    for(let prop in forSign) {
        if(forSign[prop] != undefined) {
            sorted.put(prop, forSign[prop]);
        }
    }
    let params = [];
    let entities = sorted.entrySet().iterator();
    while(entities.hasNext()) {
        let n = entities.next();
        params.push(n.getKey() + "=" + n.getValue());
    }
    params.push("key=" + nconf.get('mch_key'));
    forSign["sign"] = md5(params.join("&")).toString().toUpperCase();

    return new toXml({
        format: true,
        tagValueProcessor : (value: string) => '<![CDATA[' + value + ']]>'
    }).parse({xml: forSign})
    .toString();

}
