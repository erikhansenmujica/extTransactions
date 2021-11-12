import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ConfigHelper } from 'src/helper/confighelper.service';
@Injectable()
export class IConnectInterfase {
  constructor(
    @InjectConnection('SPConnect')
    private sequelize: Sequelize,
    private helper: ConfigHelper,
  ) {}
  async processTransaction(data: any, entity: any) {
    const [results, meta] = await this.sequelize.query(
      `DECLARE @return_value int EXEC @return_value = [dbo].[ExternalTransaction] @masterAccountCode=?,@masterAccountKey=?,@accountReferenceNumber=?,@number=?,@originalAmount=?,@originalCurrencyCode=?,@convertedAmount=?,@convertedRate=?,@convertedCurrencyCode=?,@description=?,@source=?,@status=?,@date=?,@extraData=? SELECT 'Return Value' = @return_value
     `,
      {
        replacements: [
          data.externalEntityCode,
          this.helper.getJeevesKey(),
          data.accountReferenceNumber,
          data.transactionNumber,
          data.originalCurrencyAmount,
          data.originalCurrency,
          data.TargetCurrencyAmount,
          data.OriginalToTargetExchangeRate,
          data.TargetCurrency,
          data.Description,
          entity.source,
          1,
          data.ConfirmedDateTime ? data.ConfirmedDateTime.toISOString() : '',
          JSON.stringify(data.FullData),
        ],
      },
    );
    return results[0]['Return Value'];
  }
}
