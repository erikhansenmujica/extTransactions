import {
  PrimaryKey,
  Column,
  Model,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table
export class ExternalTransaction extends Model {
  @Column
  masterAccountCode: string;
  @Column
  masterAccountKey: string;
  @Column
  accountReferenceNumber: string;
  @Column
  number: string;
  @Column
  originalAmount: number;
  @Column
  originalCurrencyCode: string;
  @Column
  convertedAmount: number;
  @Column
  convertedRate: number;
  @Column
  convertedCurrencyCode: string;
  @Column
  description: string;
  @Column
  source: number;
  @Column
  status: number;
  @Column
  date: Date;
  @Column({ type: DataType.TEXT })
  extraData: string;
}
