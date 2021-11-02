import {
  PrimaryKey,
  Column,
  Model,
  Table,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { ExternalEntityMovement } from './externalEntityMovement';

@Table
export class ExternalEntity extends Model {
  @PrimaryKey
  @Column
  code: string;
  @Column
  masterAccountCode: string;
  @Column
  userName: string;
  @Column
  source: number;
  @Column({ type: DataType.JSON })
  extraData: { previousLimit: number };
  @Column
  lastTransactionDate: Date;
  @HasMany(() => ExternalEntityMovement)
  externalMovements: ExternalEntityMovement[];
}
