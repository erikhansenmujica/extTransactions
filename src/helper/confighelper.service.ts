import { Injectable } from '@nestjs/common';
import { IHelper } from './helper.service';

@Injectable()
export class ConfigHelper {
  constructor(private helperService: IHelper) {}
  getDatabaseUser() {
    return this.helperService.getConfigValue('DATABASE_USER');
  }
  getDatabasePort() {
    return this.helperService.getConfigValue('DATABASE_PORT');
  }
  getDatabaseHost() {
    return this.helperService.getConfigValue('DATABASE_HOST');
  }
  getDatabaseName() {
    return this.helperService.getConfigValue('DATABASE_NAME');
  }
  getDatabasePassword() {
    return this.helperService.getProtectedValue('DATABASE_PASSWORD');
  }
  getSPDatabaseUser() {
    return this.helperService.getConfigValue('SP_DATABASE_USER');
  }
  getSPDatabaseHost() {
    return this.helperService.getConfigValue('SP_DATABASE_HOST');
  }
  getSPDatabasePassword() {
    return this.helperService.getProtectedValue('SP_DATABASE_PASSWORD');
  }
  getSPDatabaseName() {
    return this.helperService.getConfigValue('SP_DATABASE_NAME');
  }
  getJeevesKey() {
    return this.helperService.getConfigValue('JEEVES_KEY');
  }
  getMailSender() {
    return this.helperService.getConfigValue('MAIL_SENDER');
  }
  getMailReceiver() {
    return this.helperService.getConfigValue('MAIL_RECEIVER');
  }
  getAppErrorMailReceiver() {
    return this.helperService.getConfigValue('MAIL_APP_ERROR_RECEIVER');
  }
  getMailReceiverForLimitExceeded() {
    return this.helperService.getConfigValue(
      'MAIL_RECEIVER_FOR_LIMIT_EXCEEDED',
    );
  }
  getMailHost() {
    return this.helperService.getConfigValue('MAIL_HOST');
  }
  getMailPort() {
    return this.helperService.getConfigValue('MAIL_PORT');
  }
  getMailAuthPw() {
    return this.helperService.getProtectedValue('MAIL_AUTH_PW');
  }
  getJeevesLoginUrl() {
    return this.helperService.getConfigValue('JEEVES_LOGIN_URL');
  }
  getJeevesLoginUser() {
    return this.helperService.getConfigValue('JEEVES_LOGIN_USER');
  }
  getJeevesLoginPassword() {
    return this.helperService.getProtectedValue('JEEVES_LOGIN_PW');
  }
  getJeevesTransactionsUrl() {
    return this.helperService.getConfigValue('JEEVES_TXS_GET_URL');
  }
  alerts(limit, actual) {
    return {
      limits: this.helperService.getConfigValue('LIMITS').split(','),
      message: `Se ha pasado el limite de Jeeves de USD ${limit}. Limite actual ${actual}`,
    };
  }
}
