import { Controller, Get } from '@nestjs/common';
import { IHelper } from './helper.service';

@Controller()
export class ConfigHelper {
  constructor(private readonly helperService: IHelper) {}
  @Get()
  getDatabaseUser() {
    return this.helperService.getProtectedValue('DATABASE_USER');
  }
  @Get()
  getDatabasePort() {
    return this.helperService.getConfigValue('DATABASE_PORT');
  }
  @Get()
  getDatabaseHost() {
    return this.helperService.getConfigValue('DATABASE_HOST');
  }
  @Get()
  getDatabaseName() {
    return this.helperService.getConfigValue('DATABASE_NAME');
  }
  @Get()
  getDatabasePassword() {
    return this.helperService.getProtectedValue('DATABASE_PASSWORD');
  }
}
