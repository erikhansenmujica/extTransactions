import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { ExternalEntity } from 'src/db/externalEntity';
import { ExternalEntityMovement } from 'src/db/externalEntityMovement';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import sequelize from 'sequelize';
import { Cache } from 'cache-manager';
import { ConfigHelper } from '../helper/confighelper.service.js';
import { MailService } from '../mail/mail.service.js';
import { IHelper } from '../helper/helper.service.js';
const Op = sequelize.Op;
@Injectable()
export class ITransactionGetter {
  constructor(
    @InjectModel(ExternalEntity)
    private extEntity: typeof ExternalEntity,
    @InjectModel(ExternalEntityMovement)
    private extEntityMovements: typeof ExternalEntityMovement,
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private helper: ConfigHelper,
    private mails: MailService,
    private ihelper: IHelper,
  ) {}
  async getIp(): Promise<AxiosResponse<JSON>> {
    await this.createEntity('Jeeves');
    return await lastValueFrom(this.httpService.get('https://api.myip.com'));
  }
  async login(entityId: string) {
    let res: any = (await this.getIp()).data;
    let entity = await this.extEntity.findByPk(entityId);
    if (entityId === 'Jeeves') {
      let login = await lastValueFrom(
        this.httpService.post(this.helper.getJeevesLoginUrl(), {
          email: this.helper.getJeevesLoginUser(),
          password: this.helper.getJeevesLoginPassword(),
          isBlockedTwoFactorAuth: false,
          blockedTwoFactorAuth: '',
          ipAddress: res.ip,
          source: 3,
        }),
      );
      if (login.data && login.data.data) {
        const availableSpent = parseFloat(
          login.data.data.company.availableSpent,
        );
        this.helper.alerts().limits.forEach((limit) => {
          console.log(availableSpent, limit, entity.extraData.previousLimit);
          if (availableSpent <= limit && entity.extraData.previousLimit > limit) {
            this.mails.sendErrorMail(
              this.helper.alerts().message,
              'Limit exceeded',
              this.helper.getMailReceiverForLimitExceeded(),
            );
            entity.extraData = {
              ...entity.extraData,
              previousLimit: availableSpent,
            };
            entity.save();
            return;
          }
        });
        await this.cacheManager.set('token', login.data.data.secretToken);
      }
    }
    return entity;
  }
  async logout(where: string) {
    return true;
  }

  async getTransactions(
    fromDate: string,
    toDate: string,
    service: string,
    connect: boolean,
  ): Promise<ExternalEntityMovement[]> {
    let res: any;
    if (service === 'Jeeves') {
      if (!connect)
        res = await lastValueFrom(
          this.httpService.post(
            this.helper.getJeevesTransactionsUrl(),
            {
              startDate: fromDate ? fromDate.slice(0, 10) : '2021-08-01',
              endDate: toDate.slice(0, 10),
              sortBy: '',
              sortDirection: '',
              filterBy: {
                users: [],
                cards: [],
                cardTypes: [],
                isStatementView: false,
              },
              pending: { page: 0 },
              completed: { page: 0 },
            },
            {
              headers: {
                'x-auth-token': await this.cacheManager.get('token'),
              },
            },
          ),
        );
      else {
        res = this.extEntityMovements.findAll({
          where: {
            externalEntityCode: service,
            [Op.or]: [
              { Status: 'Confirmada' },
              { Status: 'Error' },
              { Status: 'NoEncontrada' },
            ],
          },
        });
        return res;
      }
    }
    if (res.data && res.data.data) return res.data.data;
  }
  externalEntityCode(service: string) {
    return service;
  }
  async getPendingEntityMovements(
    service: string,
    lastTransactionDate: string,
  ) {
    let res = await this.extEntityMovements.findAll({
      where: {
        externalEntityCode: service,
        transactionDateTime: {
          [Op.lte]: Date.parse(lastTransactionDate),
        },
        Status: 'Pendiente',
      },
    });

    return res;
  }
  async createEntity(service: string) {
    await this.extEntity.findOrCreate({
      where: {
        code: service,
        masterAccountCode: 'string',
        userName: 'ari',
        source: 3,
        extraData: { previousLimit: 10000000 },
      },
    });
    return service;
  }
  async getEntity(service: string) {
    const entity = await this.extEntity.findByPk(service);
    return entity;
  }
  async updateLastTransaction(service, tx) {
    return await this.extEntity.update(
      { lastTransactionDate: Date.parse(tx.transactionDateTime) },
      {
        where: {
          code: service,
        },
      },
    );
  }
}
