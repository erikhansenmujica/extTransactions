import { Injectable } from '@nestjs/common';
import { ConectProcessor } from './connectInterfase/connectProcessor';
import { JeevesProcessor } from './processors/jeevesProcessor';
import { ITransactionGetter } from './transactions.service';

@Injectable()
export class JeevesTransactionsGetter {
  constructor(
    private service: ITransactionGetter,
    private processor: JeevesProcessor,
    private connectProcessor: ConectProcessor
  ) {}

  async login() {
    return await this.service.login('Jeeves');
  }
  async logout() {
    return await this.service.logout('Jeeves');
  }
  async getTransactions(lastTransactionDate: string, toDate: string) {
    try {
      const externalTransactions: any = await this.service.getTransactions(
        lastTransactionDate,
        toDate,
        'Jeeves',
        false,
      );
      await this.processor.processTransactions(
        externalTransactions,
        null,
        null,
      );
      if (lastTransactionDate) {
        const internalTransactions =
          await this.service.getPendingEntityMovements(
            'Jeeves',
            lastTransactionDate,
          );
        if (internalTransactions.length) {
          let lastinttx: any = internalTransactions.sort((a: any, b: any) => {
            return (
              Date.parse(b.transactionDateTime) -
              Date.parse(a.transactionDateTime)
            );
          });
          //buscar las transacciones a jeeves
          const externalTransactionsWerePending: any =
            await this.service.getTransactions(
              lastinttx[lastinttx.length - 1].transactionDateTime.toISOString(),
              lastinttx[0].transactionDateTime.toISOString(),
              'Jeeves',
              false,
            );
          await this.processor.processTransactions(
            [
              ...externalTransactionsWerePending.completed.transactions,
              ...externalTransactionsWerePending.pending.transactions,
            ],
            true,
            internalTransactions,
          );
        }
      }
      let arr = [
        ...externalTransactions.completed.transactions,
        ...externalTransactions.pending.transactions,
      ];
      let lasttx = arr.sort((a, b) => {
        return (
          Date.parse(b.transactionDateTime) - Date.parse(a.transactionDateTime)
        );
      });
      await this.logout();
      await this.service.updateLastTransaction('Jeeves', lasttx[0]);
      const confirmedAndErrorTxs = await this.service.getTransactions(
        '',
        '',
        'Jeeves',
        true,
      );
      const entity=await this.service.getEntity("Jeeves")
      await this.connectProcessor.processTransactions(confirmedAndErrorTxs, entity);
      return { message: 'Done' };
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  externalEntityCode() {
    this.service.externalEntityCode('Jeeves');
  }
}
