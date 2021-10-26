import {
  PrimaryKey,
  Column,
  Model,
  Table,
  HasMany,
} from 'sequelize-typescript';
import { Transactions } from './transactions';

@Table
export class Users extends Model {
  @PrimaryKey
  @Column
  id: number;
  @Column
  firstName: string;
  @Column
  lastName: string;
  @Column
  role: string;
  @HasMany((type) => Transactions)
  transactions: Transactions[];
}
