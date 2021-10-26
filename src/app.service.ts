import { Injectable } from '@nestjs/common';
import { ConfigHelper } from './helper/helper.controller';
import { TransactionsController } from './transactions/transactions.controller';

@Injectable()
export class AppService {
  constructor(private helper: ConfigHelper, private transactionGetter: TransactionsController){}
  getHello(): string {
    return 'Hello World!';
  }
  process(){
    
  }
}
