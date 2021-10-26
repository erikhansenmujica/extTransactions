import {
  PrimaryKey,
  Column,
  Model,
  Table,
  DataType,
} from 'sequelize-typescript';

@Table
export class ExternalEntityMovement extends Model {
  @PrimaryKey
  @Column
  id: number;
  @Column
  externalEntityId: string;
  @Column
  transactionNumber: string;
  @Column
  transactionDateTime: string;
  @Column
  accountReferenceNumber: string;
  @Column
  originalCurrency: string;
  @Column
  originalCurrencyAmount: string;
  @Column
  TargetCurrency: string;
  @Column
  TargetCurrencyAmount: string;
  @Column
  OriginalToTargetExchangeRate: string;
  @Column
  Description: string;
  @Column
  Status: string; // Pendiente, Confirmada, Procesada, NoEncontrada, Error, Eliminada)
  @Column
  ConfirmedDateTime: string;
  @Column
  ProcessedDateTime: string;
  @Column
  ErrorMessage: string;
  @Column
  FullData: string;
}
