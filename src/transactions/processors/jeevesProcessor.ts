import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ExternalEntity } from 'src/db/externalEntity';
import { ExternalEntityMovement } from 'src/db/externalEntityMovement';
import { ITransactionGetter } from '../transactions.service';
import { HttpService } from '@nestjs/axios';
import moment from 'moment';
@Injectable()
export class JeevesProcessor {
  constructor(
    @InjectModel(ExternalEntity)
    private extEntity: typeof ExternalEntity,
    @InjectModel(ExternalEntityMovement)
    private extEntityMovements: typeof ExternalEntityMovement,
    private httpService: HttpService,
  ) {}
  async processTransactions(
    transactions: any,
    werePending: any,
    internalTransactions: any,
  ) {
    if (!werePending) {
      transactions.completed.transactions.forEach(async (tx) => {
        await this.insertTx('Confirmada', tx);
      });
      transactions.pending.transactions.forEach(async (tx) => {
        await this.insertTx('Pendiente', tx);
      });
    } else {
      internalTransactions.length &&
        internalTransactions.forEach(async (tx) => {
          const extTx = transactions.filter(
            (t) => t.id === tx.transactionNumber,
          )[0];
          if (!extTx) {
            await this.extEntityMovements.destroy({
              where: { transactionNumber: tx.transactionNumber },
            });
          } else if (extTx.transactionStatus === 'completed') {
            tx.update({
              Status: 'Confirmada',
              ConfirmedDateTime: extTx.completedAt,
            });
            await tx.save();
          }
        });
    }
  }

  async insertTx(status, tx) {
    const txs = await this.extEntityMovements.findAll({
      where: {
        transactionNumber: tx.id.toString(),
      },
    });
    if (!txs.length) {
      await this.extEntityMovements.create({
        externalEntityCode: 'Jeeves',
        transactionNumber: 'JV-' + tx.id,
        transactionDateTime: tx.transactionDateTime,
        accountReferenceNumber:
          tx.user && tx.user.firstName.trim() + '/' + tx.user.lastName.trim(),
        originalCurrency: tx.localCurrencyLookup.alphaCode,
        originalCurrencyAmount: tx.localCurrencyAmount,
        TargetCurrency: tx.currencyAlphaCode,
        TargetCurrencyAmount: tx.transactionAmount,
        OriginalToTargetExchangeRate: null,
        Description: tx.card && tx.card.cardNumber + ' ' + tx.merchant.name,
        Status: status, // Pendiente, Confirmada, Procesada, NoEncontrada, Error, Eliminada)
        ConfirmedDateTime: tx.completedAt,
        ProcessedDateTime: null,
        ErrorMessage: null,
        FullData: tx,
      });
    } else if (
      txs.length === 1 &&
      status === 'Confirmada' &&
      txs[0].Status !== 'Confirmada'
    ) {
      txs[0].update({
        Status: 'Confirmada',
        ConfirmedDateTime: tx.completedAt,
      });
      await txs[0].save();
    }
  }
}
