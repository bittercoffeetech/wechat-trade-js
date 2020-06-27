import 'jest';

import { ErrorCodeEnum } from '../src/enums/error_code';
import * as wechatClient from '../src/main';
import { TNO, WechatApiError } from '../src/models/base';
import { TradeQueryResponseModel } from '../src/models/pay_query';
import { RTNO, TradeRefundQueryResponseModel } from '../src/models/refund_query';

it('Test Trade Query OK', async () => {   
    await wechatClient.queryTrade(TNO('90013580520959892632499715588959')).then((r: TradeQueryResponseModel | undefined) => {
        expect(r).toBeDefined();
        expect(r.tradeNo).toBe('90013580520959892632499715588959');
        expect(r.openId).toBe('oenOB4tQ2pKtKuWSp6eGwf9XNjsY');
    }).catch( (e) => {
        console.log(e);
    });
    
});

it('Test Trade Query Failed', async () =>{
    await wechatClient.queryTrade(TNO('90013580520959892632499715580000')).then((_r: TradeQueryResponseModel | undefined) => {
        // dont't fired
    }).catch( (e: WechatApiError) => {
        expect(e.code).toBe(ErrorCodeEnum.ORDERNOTEXIST);
    });

});

it('Test Query Refund', async () =>{
    await wechatClient.queryRefund(RTNO('90013580520959892632499715588959')).then((_r: TradeRefundQueryResponseModel | undefined) => {
        expect(_r).toBeDefined();
        expect(_r.totalFee).toBe(30000);
        expect(_r.refunds[0].refundFee).toBe(23000);
    }).catch( (e: WechatApiError) => {
        expect(true).toBe(false);
    });

});

test('Test Sheet Invalid Date', async() => {
    await wechatClient.downloadBillAll(2019,6,22,true).then((_data) => {
        // never happened
    }).catch((e: WechatApiError) => {
        expect(e.code).toBe('20001')
    });
})

test('Test Ziped Content', async() => {
    await wechatClient.downloadBillAll(2020,6,22,true).then((_data) => {
        expect(_data.records.length > 0);
        expect(_data.summary.totalTrades).toBe(2);
        expect(_data.summary.totalRefundFee).toBe(220.4);
    }).catch((_e: WechatApiError) => {
        expect(false).toBe(true);
    });
})

test('Test No ziped Content', async() => {
    await wechatClient.downloadBillAll(2020,6,22,false).then((_data) => {
        expect(_data.records.length > 0);
        expect(_data.summary.totalTrades).toBe(2);
        expect(_data.summary.totalRefundFee).toBe(220.4);
    }).catch((_e: WechatApiError) => {
        expect(false).toBe(true);
    });    
})

test('Test Download Fundflow', async () => {
    await wechatClient.downloadBasicFundflow(2020,6,22).then((_data) => {
        expect(_data.summary.totalFlows).toBe(4);
        expect(_data.summary.totalIncomeFee).toBe(300);
        expect(_data.records.length).toBe(4);
    }).catch((e) => {
        expect(true).toBe(false);
    });
})

test('Test Bill Refund', async() => {
    await wechatClient.downloadBillRefund(2020,6,22,true).then((_data) => {
        expect(_data.records.length).toBe(1);
        expect(_data.summary.totalTrades).toBe(1);
        expect(_data.summary.totalRefundFee).toBe(220.4);
    }).catch((_e: WechatApiError) => {
        console.log(_e.message)
        expect(false).toBe(true);
    });
})

test('Test Bill Success', async() => {
    await wechatClient.donwloadBillSuccess(2020,6,22,true).then((_data) => {
          expect(_data.records.length).toBe(1);
        expect(_data.summary.totalTrades).toBe(1);
        expect(_data.summary.settlementTotalFee).toBe(300);
    }).catch((_e: WechatApiError) => {
        expect(false).toBe(true);
    });
})