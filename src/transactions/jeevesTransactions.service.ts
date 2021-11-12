import { Injectable } from '@nestjs/common';
import { ConfigHelper } from 'src/helper/confighelper.service';
import { MailService } from 'src/mail/mail.service';
import { ConectProcessor } from './connectInterfase/connectProcessor';
import { JeevesProcessor } from './processors/jeevesProcessor';
import { ITransactionGetter } from './transactions.service';

@Injectable()
export class JeevesTransactionsGetter {
  constructor(
    private service: ITransactionGetter,
    private processor: JeevesProcessor,
    private connectProcessor: ConectProcessor,
    private mailing: MailService,
    private helper: ConfigHelper,
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
      if (lasttx[0])
        await this.service.updateLastTransaction('Jeeves', lasttx[0]);
      const confirmedAndErrorTxs = await this.service.getTransactions(
        '',
        '',
        'Jeeves',
        true,
      );
      const entity = await this.service.getEntity('Jeeves');
      await this.connectProcessor.processTransactions(
        confirmedAndErrorTxs,
        entity,
      );
      return { message: 'Done' };
    } catch (error) {
      this.mailing.sendErrorMail(
        'Error ' + error + ' in server',
        'Error with transaction',
        this.helper.getAppErrorMailReceiver(),
      );
      console.log(error);
      return error;
    }
  }
  externalEntityCode() {
    this.service.externalEntityCode('Jeeves');
  }
}
