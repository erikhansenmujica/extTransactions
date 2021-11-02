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
    private helper: ConfigHelper
  ) {}
  async processTransactions(internalTransactions: any, entity: any) {
    const rates = await lastValueFrom(
      this.httpService.get(
        'https://openexchangerates.org/api/latest.json?app_id=d574bff1aa7c49f8b970c263cbeecd2b&base=USD',
      ),
    );
    if (internalTransactions.length)
      for await (const tx of internalTransactions) {
        tx.rates = rates;
        let val = await this.service.processTransaction(tx, entity);
        if (val === 1) {
          tx.Status = 'Error';
          this.mailing.sendErrorMail(
            'Master account not fount: ' + JSON.stringify(tx),
            'Error with transaction',this.helper.getMailReceiver()
          );
        } else if (val === 2) {
          tx.Status = 'NoEncontrada';
        } else if (val === 3) {
          tx.Status = 'Procesada';
        } else if (val === 0) {
          tx.Status = 'Procesada';
        } else if (val === -1) {
          this.mailing.sendErrorMail(
            'Conversión inválida: ' + JSON.stringify(tx),
            'Error with transaction',this.helper.getMailReceiver()
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
