import {
  PrimaryKey,
  Column,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { Transactions } from './transactions';
@Table
export class Cards extends Model {
  @PrimaryKey
  @Column
  id: number;
  @Column
  name: string;
  @Column
  cardNumber: string;
  @HasMany((type) => Transactions)
  transactions: Transactions[];
}
