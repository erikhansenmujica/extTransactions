import { Module, CacheModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { IHelper } from './helper/helper.service';
import { ConfigHelper } from './helper/confighelper.service';
import { ExternalEntityMovement } from './db/externalEntityMovement';
import { ExternalEntity } from './db/externalEntity';
import { ITransactionGetter } from './transactions/transactions.service';
import { JeevesTransactionsGetter } from './transactions/jeevesTransactions.service';
import { HelperModule } from './helper/helper.module';
import { HttpModule } from '@nestjs/axios';
import { TransactionsModule } from './transactions/transactions.module';
import { JeevesProcessor } from './transactions/processors/jeevesProcessor';
import { ConectProcessor } from './transactions/connectInterfase/connectProcessor';
import { IConnectInterfase } from './transactions/connectInterfase/connectInterfase.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './mail/mail.service';
import { config } from 'process';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [HelperModule],
      inject: [IHelper, ConfigHelper],
      useFactory: (iHelper: IHelper, configHelper: ConfigHelper) => ({
        transport: {
          host: configHelper.getMailHost(),
          port: +configHelper.getMailPort(),
          secure: true,
          auth: {
            user: configHelper.getMailSender(),
            pass: configHelper.getMailAuthPw(),
          },
        },
      }),
    }),
    SequelizeModule.forRootAsync({
      imports: [HelperModule],
      inject: [IHelper, ConfigHelper],
      useFactory: (iHelper: IHelper, configHelper: ConfigHelper) => {
        return {
          dialect: 'postgres',
          username: configHelper.getDatabaseUser(),
          port: +configHelper.getDatabasePort(),
          host: configHelper.getDatabaseHost(),
          database: configHelper.getDatabaseName(),
          password: configHelper.getDatabasePassword(),
          models: [ExternalEntity, ExternalEntityMovement],
          synchronize: true,
          autoLoadModels: true,
          force: false,
          alter: true,
        };
      },
    }),
    SequelizeModule.forRootAsync({
      imports: [HelperModule],
      inject: [IHelper, ConfigHelper],
      name: 'SPConnect',
      useFactory: (iHelper: IHelper, configHelper: ConfigHelper) => {
        return {
          dialect: 'mssql',
          username: configHelper.getSPDatabaseUser(),
          host: configHelper.getSPDatabaseHost(),
          password: configHelper.getSPDatabasePassword(),
          database: configHelper.getSPDatabaseName(),
          synchronize: true,
          autoLoadModels: true,
          force: false,
        };
      },
    }),
    SequelizeModule.forFeature([], 'SPConnect'),
    SequelizeModule.forFeature([ExternalEntity, ExternalEntityMovement]),
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HelperModule,
    TransactionsModule,
    HttpModule,
    CacheModule.register(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    IHelper,
    JeevesTransactionsGetter,
    ITransactionGetter,
    JeevesProcessor,
    ConectProcessor,
    IConnectInterfase,
    MailService,
  ],
})
export class AppModule {}
