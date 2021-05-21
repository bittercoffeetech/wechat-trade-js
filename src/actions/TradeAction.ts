import { TradeRequest } from './TradeRequest';
import { TradeResponse } from './TradeResponse';

/**
 * 接口完整定义
 */
 export interface TradeAction<R, S> extends TradeRequest<R>, TradeResponse<S> {
	// no other things	
}