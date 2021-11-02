import { Injectable } from '@nestjs/common';
import { encript } from './encrypt';
import { JeevesTransactionsGetter } from './transactions/jeevesTransactions.service';

@Injectable()
export class AppService {
  constructor(private jeeves: JeevesTransactionsGetter
    ) {}

  async processJeeves() {
    encript("Wirsolut.1")

    let jeeves: any = await this.jeeves.login();
    if (jeeves) {
      let transactions = await this.jeeves.getTransactions(
        jeeves.lastTransactionDate?jeeves.lastTransactionDate.toISOString() : '',
        new Date().toISOString(),
      );
      return transactions;
    } else {
      return 'login failed';
    }
  }

  getHello(): string {
    return "I'm on point!";
  }
}
