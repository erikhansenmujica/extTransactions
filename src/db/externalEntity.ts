import {
  PrimaryKey,
  Column,
  Model,
  Table,
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
  @Column
  lastTransactionDate: Date;
  @HasMany(() => ExternalEntityMovement)
  externalMovements: ExternalEntityMovement[];
}
