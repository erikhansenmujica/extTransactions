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
  async processTransaction(data: any, entity:any) {
    const [results, meta] = await this.sequelize.query(
      `DECLARE @return_value int EXEC @return_value = [dbo].[ExternalTransaction] @masterAccountCode="${
      data.externalEntityCode
    }",@masterAccountKey="${this.helper.getJeevesKey()}",@accountReferenceNumber="${
        data.accountReferenceNumber
      }",@number="${data.transactionNumber}",@originalAmount=${
        data.originalCurrencyAmount
      },@originalCurrencyCode="${data.originalCurrency}",@convertedAmount=${
        data.TargetCurrencyAmount
      },@convertedRate=${
        data.OriginalToTargetExchangeRate
      },@convertedCurrencyCode="${data.TargetCurrency}",@description="${
        data.Description
      }",@source=${entity.source},@status=${1},@date="${
        data.ConfirmedDateTime?data.ConfirmedDateTime.toISOString():""
      }",@extraData="${data.FullData}" SELECT 'Return Value' = @return_value
     `,
    );
    return results[0]['Return Value'];
  }
}
