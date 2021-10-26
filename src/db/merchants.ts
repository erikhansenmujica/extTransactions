import {
  PrimaryKey,
  Column,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { Transactions } from './transactions';
@Table
export class Merchants extends Model {
  @PrimaryKey
  @Column
  id: number;
  @Column
  name: string;
  @Column
  address: string;
  @Column
  description: string;
  @Column
  website: string;
  @HasMany((type) => Transactions)
  transactions: Transactions[];
}
