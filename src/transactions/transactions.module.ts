import { Module, CacheModule } from '@nestjs/common';
import { ITransactionGetter } from './transactions.service';
import { JeevesTransactionsGetter } from './jeevesTransactions.service';
import { getConnectionToken, SequelizeModule } from '@nestjs/sequelize';
import { ExternalEntity } from 'src/db/externalEntity';
import { ExternalEntityMovement } from 'src/db/externalEntityMovement';
import { HttpModule } from '@nestjs/axios';
import { JeevesProcessor } from './processors/jeevesProcessor';
import { ConectProcessor } from './connectInterfase/connectProcessor';
import { IConnectInterfase } from './connectInterfase/connectInterfase.service';
import { ConfigHelper } from 'src/helper/confighelper.service';
import { IHelper } from 'src/helper/helper.service';
import { MailService } from 'src/mail/mail.service';
@Module({
  imports: [
    SequelizeModule.forFeature([ExternalEntity, ExternalEntityMovement]),
    SequelizeModule.forFeature([], 'SPConnect'),
    HttpModule,
    CacheModule.register(),
  ],
  providers: [
    ITransactionGetter,
    JeevesTransactionsGetter,
    JeevesProcessor,
    ConectProcessor,
    IConnectInterfase,
    ConfigHelper,
    IHelper,
    MailService,
  ],
  exports: [ITransactionGetter, JeevesTransactionsGetter],
})
export class TransactionsModule {}
