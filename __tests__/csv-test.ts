import { TradeBillRefundResponseModel } from "../src/models/TradeSheetModels";
import { parseCsvResponse } from "../src/response"
import { resolve } from "path";
// import { default as axios } from "axios";

it('csv response test', async () => {

    await parseCsvResponse(require('fs').createReadStream(resolve('./__tests__/data/refund.txt')),
        TradeBillRefundResponseModel )
        .then((v) => {
            console.log(v); 
        });

});

