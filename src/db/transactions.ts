import {
  PrimaryKey,
  Column,
  Model,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table
export class Transactions extends Model {
  @PrimaryKey
  @Column
  id: number;
  @Column
  transactionAmount: string;
  @Column
  transactionDateTime: string;
  @Column
  completedAt: string;
  @Column
  transactionStatus: string;
  @Column
  transactionType: string;
  @Column
  cardType: string;
  @Column
  paymentType: string;
  @Column
  description: string;
  @Column
  currency: number;
  @Column
  localCurrency: number;
  @Column
  localCurrencyAmount: string;
  @Column
  memo: string;
  @Column
  authStatus: string;
  @Column
  cardServiceType: string;
  @Column
  beneficiaryId: number;
  @Column
  subPaymentType: string;
  @Column
  stpTransactionId: number;
  @Column
  currencyAlphaCode: string;
  @Column
  transBillPayBiller: string;
  @Column
  transaction_scheduling: string;
  @Column
  beneficiary: string;
  @Column
  parentTransaction: string;
  @Column({ type: DataType.ARRAY })
  transactionReceipts: [];
}
