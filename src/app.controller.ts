import { Controller, Get, Injectable, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ExternalEntity, ExternalEntityMovement } from 'src/db/models';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/process-transactions/jeeves')
  async processJeeves() {
    let res = await this.appService.processJeeves();
    return res;
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
