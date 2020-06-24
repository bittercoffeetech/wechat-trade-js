import 'jest';
import * as client from '../src/WechatTradeClient';
import { withTradeNo } from '../src/models/TradeCommons';
import { WechatApiError } from '../src/WechatTradeClient';
import { ErrorCodeEnum } from '../src/enums/ErrorCodeEnum';
import { TradeQueryResponseModel } from '../src/models/TradeQueryModels';
import { TradeBillAllModel, TradeBillAllResponseModel } from '../src/models/TradeSheetModels';

// it('Test Trade Query OK', async () => {   
//     await client.newQueryAction(withTradeNo('90013580520959892632499715588959')).execute().then((r: TradeQueryResponseModel | undefined) => {
//         expect(r).toBeDefined();
//         expect(r.tradeNo).toBe('90013580520959892632499715588959');
//         expect(r.openId).toBe('oenOB4tQ2pKtKuWSp6eGwf9XNjsY');
//     }).catch( (e) => {
//         console.log(e);
//     });
    
// });

// it('Test Trade Query Failed', async () =>{
//     await client.newQueryAction(withTradeNo('90013580520959892632499715580000')).execute().then((_r: TradeQueryResponseModel | undefined) => {
//         // dont't fired
//     }).catch( (e: WechatApiError) => {
//         expect(e.code).toBe(ErrorCodeEnum.ORDERNOTEXIST);
//     });

// });

it('Test Sheet', async() => {

    await client.newBillAllAction(new TradeBillAllModel(2020,6,22,true)).execute().then((r: TradeBillAllResponseModel | undefined) => {
        console.log(r);
    }).catch((e) => {
        console.log(e);
    })

})