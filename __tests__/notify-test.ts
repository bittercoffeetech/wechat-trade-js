import * as client from '../src/client';

test('Test Pay Notify', () => {
    let xml = "<xml><appid><![CDATA[wx8949c222019862f5]]></appid>\n" + 
    "<bank_type><![CDATA[ABC_CREDIT]]></bank_type>\n" + 
    "<cash_fee><![CDATA[30000]]></cash_fee>\n" + 
    "<fee_type><![CDATA[CNY]]></fee_type>\n" + 
    "<is_subscribe><![CDATA[N]]></is_subscribe>\n" + 
    "<mch_id><![CDATA[1234539902]]></mch_id>\n" + 
    "<nonce_str><![CDATA[82784474056159375379525796738557]]></nonce_str>\n" + 
    "<openid><![CDATA[oenOB4lS8ZxHniQtaf455UbvhLHI]]></openid>\n" + 
    "<out_trade_no><![CDATA[54468989721541219324177967799889]]></out_trade_no>\n" + 
    "<result_code><![CDATA[SUCCESS]]></result_code>\n" + 
    "<return_code><![CDATA[SUCCESS]]></return_code>\n" + 
    "<sign><![CDATA[37AE598C40C5742A9EB30BC95BA06F1B]]></sign>\n" + 
    "<time_end><![CDATA[20200418152047]]></time_end>\n" + 
    "<total_fee>30000</total_fee>\n" + 
    "<trade_type><![CDATA[JSAPI]]></trade_type>\n" + 
    "<transaction_id><![CDATA[4200000533202004182563767929]]></transaction_id>\n" + 
    "</xml>";

    let result = client.onPayNotified(xml);
    expect(result).toBeDefined();
    expect(result.tradeNo).toBe('54468989721541219324177967799889')
});


test('Test Refund Notify', () => {
    let xml = "<xml><return_code>SUCCESS</return_code><appid><![CDATA[wx8949c222019862f5]]></appid><mch_id><![CDATA[1234539902]]></mch_id><nonce_str><![CDATA[de4e47447977e3dcb3eb9387fbf762c9]]></nonce_str><req_info><![CDATA[uvKMQDEpn3NlbNP8QzKttALjM+vbORI2+L4GpbD0hO46Vt7eE33JxdAniQTiGL+VY/yyXB7GGE75LbBznrU3H/hHL45whraQtilM1EymKOK2nBZ94wbKxe2AfnYKrekaL25VEXzibrcsktDTN7naWHC8HkCkdl8zq2/lo69dZP8nCipE0VKSfMeXF5IFDKuMBPlhJ1sLX9qRyB+SkuWwFvhIbenaQi5ur7RyUuzgMbch+mDKI1FCD6664IKFycI+nihJQval6g9AdEWbHX0nK/sm6Kdz2OrGClo6KAWKxsXyTQDzecHrLr7F48NFaUz82G38RkE0o9S8dudpgIIDpw4n2B6u0GFVmu0HDk0wHtFC5DSzST0bRdOu3w9BVwicrvcYqcpEkheeJw3+Mh6tM3oYHzp6oC6fA3tXlVhYoVJeknEZWXt85v5+F4DlOn9z7X5gFUn2VHFdGgd+AMYW0BvcBUJmLupWfT96v9yC4YtvYTsn8SPIhpHRU7fRXGpnBcRyapRdTyQ79PuqQ1UCc7swLHA9vHAZX2fv+o8zuczxjARBCAV4F9hYX2dU4gVNs14mfwPwxUBzZEyvTNzMJlg4mphMCmlZcuKBsUzIRmmvMnKrFMdgDBsTEdfU/5Tu6RAP46rgK0y1nKafmkaoBAFzUFbmWHHl2xkub5wGimacHOT+TgxBSO3LUjGk5zPhnX8XJ320fm1p3l5XfoIazFaeC2kTLdwLXHkAGe08e8eesl7fOgQ1lJfW+dMFNV7BviFnDW5++zzv2pw4ZvttjeUgSY5HYioIgCJSG/t+L5DxlsvDv+O7Yr4JvBjTKswmcq+zpg2M8aaX5MbEe9vJHP40tTZK051rUQAPW2iEKCDVMBgsj+U0IhZDVwr9zMxb+8dSAsnbrzjj1gnCJkpbncFWIl08RTZxl80oqL6ak0F4Ios2QuxtaRDSz3LrqdkSBYi17Ut95+wlgqEmekr0NCZ26EFcfnp7qfbbh33LGA+1ZteWjQKueWxBsMuCtBvKhJomn2Wga6qrAfBxYdUES8opno7wj5iNhs0qBUQfyr8FQechAeX3j4fMrPcHg1r/CJN770qx3d+WB+Nk7EkJDWVCAeKSbGDQ0E5jYILTnVM=]]></req_info></xml>";
    let result = client.onRefundNotified(xml);
    expect(result).toBeDefined();
    expect(result.tradeNo).toBe('84280431833077320492059492239636');
    expect(result.refundFee).toBe(23000);
});