
import { TradeRequest } from './TradeRequest';
import { TradeSheetResponse } from './TradeSheetResponse';

export interface TradeSheetAction<R, ST, RT> extends TradeRequest<R>, TradeSheetResponse<ST, RT> {
	// no other things.
}