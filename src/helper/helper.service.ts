import { Get, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IHelper {
  constructor(private configService: ConfigService) {}
  @Get()
  getParameter() {}
  @Get()
  getConfigValue(value:string) {
    return this.configService.get<string>(value);
  }
  @Get()
  getProtectedValue(value:string) {
    return this.configService.get<string>(value);
  }
}
