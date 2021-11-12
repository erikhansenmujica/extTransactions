import { MailerService } from '@nestjs-modules/mailer';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { lastValueFrom } from 'rxjs';
import { ConfigHelper } from 'src/helper/confighelper.service';
import { MailService } from 'src/mail/mail.service';
import { IConnectInterfase } from './connectInterfase.service';
@Injectable()
export class ConectProcessor {
  constructor(
    private service: IConnectInterfase,
    private httpService: HttpService,
    private mailing: MailService,
    private helper: ConfigHelper,
  ) {}
  async processTransactions(internalTransactions: any, entity: any) {
    const rates = await lastValueFrom(
      this.httpService.get(
        'https://openexchangerates.org/api/latest.json?app_id=d574bff1aa7c49f8b970c263cbeecd2b&base=USD',
      ),
    );
    if (internalTransactions.length)
      for await (const tx of internalTransactions) {
        tx.FullData.rates = rates.data.rates;
        let val = await this.service.processTransaction(tx, entity);
        let errorMessage = '';
        const FUNDS_EXCEEDED = -2;
        const INVALID_CONVERSION = -1;
        const PROCESSED_OK = 0;
        const MASTER_ACCOUNT_NOT_FOUND = 1;
        const ACCOUNT_NOT_FOUND = 2;
        const ACCOUNT_MOVEMENT_NUMBER_DUPLICATE_FOR_DATE = 3;
        switch (val) {
          case MASTER_ACCOUNT_NOT_FOUND:
            tx.Status = 'Error';
            errorMessage = 'Mater account no encontrada';
            break;
          case ACCOUNT_NOT_FOUND:
            tx.Status = 'NoEncontrada';
            break;
          case ACCOUNT_MOVEMENT_NUMBER_DUPLICATE_FOR_DATE:
            tx.Status = tx.Status == 'Pendiente' ? 'Error' : 'Procesada';
            errorMessage = 'Movimiento duplicado';
            break;
          case INVALID_CONVERSION:
            tx.Status = 'ErrorNegocio';
            errorMessage = 'Conversi��n inv��lida';
            break;
          case FUNDS_EXCEEDED:
            tx.Status = 'Procesada';
            errorMessage = 'Saldo insuficiente (procesada igualmente)';
            this.mailing.sendErrorMail(
              'Error ' +
                errorMessage +
                ' funds exceeded: ' +
                JSON.stringify(tx),
              'Error with transaction',
              this.helper.getMailReceiverForLimitExceeded(),
            );
            break;
          default:
            tx.Status = 'Procesada';
            break;
        }
        if (tx.Status == 'Error') {
          this.mailing.sendErrorMail(
            'Error ' +
              errorMessage +
              ' processing transaction: ' +
              JSON.stringify(tx),
            'Error with transaction',
            this.helper.getMailReceiver(),
          );
        } else if (tx.Status == 'ErrorNegocio') {
          this.mailing.sendErrorMail(
            'Error ' +
              errorMessage +
              ' processing transaction: ' +
              JSON.stringify(tx),
            'Error with transaction',
            this.helper.getMailReceiverForLimitExceeded(),
          );
        }

        await tx.save();
        console.log({
          response: val,
          reference: tx.accountReferenceNumber,
          originalCurrency: tx.originalCurrency,
          targetCurrency: tx.TargetCurrency,
        });
      }
    return 'Finished';
  }
}
