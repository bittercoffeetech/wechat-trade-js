import { Expose } from 'class-transformer';

import { CsvColumns } from '../decorators/CsvColumns';

/**
 * 资金账单概要
 */
 @CsvColumns(['total_flows', 'total_incomes', 'total_income_fee', 'total_expenses', 'total_expenses_fee'])
 export class TradeFundflowSummaryInfo {
 
     /**
      * 资金流水总笔数
      */
     @Expose({ name: "total_flows" })
     totalFlows!: number;
 
     /**
      * 收入笔数
      */
     @Expose({ name: "total_incomes" })
     totalIncomes!: number;
 
     /**
      * 收入金额
      */
     @Expose({ name: "total_income_fee" })
     totalIncomeFee!: number;
 
     /**
      * 支出笔数
      */
     @Expose({ name: "total_expenses" })
     totalExpenses!: number;
 
     /**
      * 支出金额
      */
     @Expose({ name: "total_expenses_fee" })
     totalExpensesFee!: number;
 }