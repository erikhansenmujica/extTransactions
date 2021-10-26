import {
    PrimaryKey,
    Column,
    Model,
    Table,
    DataType,
  } from 'sequelize-typescript';
  
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
    lastTransactionDate: string;
  }
  