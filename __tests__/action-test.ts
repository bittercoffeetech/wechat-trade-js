import 'jest';

import * as client from '../src/client';
import { WechatApiError } from '../src/models/base';
import { TradeBillAllModel } from '../src/models/sheet_models';

// it('Test Trade Query OK', async () => {   
//     await client.queryTrade(withTradeNo('90013580520959892632499715588959')).then((r: TradeQueryResponseModel | undefined) => {
//         expect(r).toBeDefined();
//         expect(r.tradeNo).toBe('90013580520959892632499715588959');
//         expect(r.openId).toBe('oenOB4tQ2pKtKuWSp6eGwf9XNjsY');
//     }).catch( (e) => {
//         console.log(e);
//     });
    
// });

// it('Test Trade Query Failed', async () =>{
//     await client.queryTrade(withTradeNo('90013580520959892632499715580000')).then((_r: TradeQueryResponseModel | undefined) => {
//         // dont't fired
//     }).catch( (e: WechatApiError) => {
//         expect(e.code).toBe(ErrorCodeEnum.ORDERNOTEXIST);
//     });

// });

test('Test Sheet Invalid Date', async() => {
    await client.downloadBillAll(new TradeBillAllModel(2019,6,22,true)).then((_data) => {
        // never happened
    }).catch((e: WechatApiError) => {
        expect(e.code).toBe('20001')
    });
})

// test('Test Ziped Content', async() => {
//     await client.downloadBillAll(new TradeBillAllModel(2020,6,22,true)).then((_data) => {
//         expect(_data.records.length > 0);
//     }).catch((e: WechatApiError) => {
        
//     });
// })

// test('Test No ziped Content', async() => {
//     await client.downloadBillAll(new TradeBillAllModel(2020,6,22,false)).then((_data) => {
//         expect(_data.records.length > 0);
//     }).catch((e: WechatApiError) => {
        
//     });    
// })