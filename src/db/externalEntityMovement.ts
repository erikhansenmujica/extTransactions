import {
  PrimaryKey,
  Column,
  Model,
  Table,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType,
  NotNull,
  Default,
} from 'sequelize-typescript';
import { ExternalEntity } from './externalEntity';

@Table
export class ExternalEntityMovement extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;
  @ForeignKey(() => ExternalEntity)
  @Column
  externalEntityCode: string;
  @Column
  transactionNumber: string;
  @Column
  transactionDateTime: Date;
  @Column
  accountReferenceNumber: string;
  @Column
  originalCurrency: string;
  @Column({ type: DataType.DECIMAL(30, 8) })
  originalCurrencyAmount: number;
  @Column
  TargetCurrency: string;
  @Column({ type: DataType.DECIMAL(30, 8) })
  TargetCurrencyAmount: number;
  @Column({ type: DataType.DECIMAL(18, 8) })
  OriginalToTargetExchangeRate: number;
  @Column
  Description: string;
  @Column
  Status: string; // Pendiente, Confirmada, Procesada, NoEncontrada, Error, Eliminada)
  @Column
  ConfirmedDateTime: Date;
  @Column
  ProcessedDateTime: Date;
  @Column
  ErrorMessage: string;
  // @Column
  // ErrorCount: number;
  @Column({ type: DataType.JSON })
  FullData: {};
  @BelongsTo(() => ExternalEntity)
  externalEntity: ExternalEntity;
}


