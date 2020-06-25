import 'jest';
import * as client from '../src/WechatTradeClient';
import { withTradeNo, WechatApiError } from '../src/models/TradeCommons';
import { ErrorCodeEnum } from '../src/enums/ErrorCodeEnum';
import { TradeQueryResponseModel } from '../src/models/TradeQueryModels';
import { TradeBillAllModel } from '../src/models/TradeSheetModels';

it('Test Trade Query OK', async () => {   
    await client.queryTrade(withTradeNo('90013580520959892632499715588959')).then((r: TradeQueryResponseModel | undefined) => {
        expect(r).toBeDefined();
        expect(r.tradeNo).toBe('90013580520959892632499715588959');
        expect(r.openId).toBe('oenOB4tQ2pKtKuWSp6eGwf9XNjsY');
    }).catch( (e) => {
        console.log(e);
    });
    
});

it('Test Trade Query Failed', async () =>{
    await client.queryTrade(withTradeNo('90013580520959892632499715580000')).then((_r: TradeQueryResponseModel | undefined) => {
        // dont't fired
    }).catch( (e: WechatApiError) => {
        expect(e.code).toBe(ErrorCodeEnum.ORDERNOTEXIST);
    });

});

it('Test Sheet', async() => {

    await client.downloadBillAll(new TradeBillAllModel(2020,6,22,true)).then((r: TradeBillAllResponseModel | undefined) => {
        console.log(r);
    }).catch((e) => {
        console.log(e);
    })

})