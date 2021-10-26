import { Module } from '@nestjs/common';
import { IHelper } from './helper.service';
import { ConfigHelper } from './helper.controller';

@Module({
  controllers: [ConfigHelper],
  providers: [IHelper]
})
export class HelperModule {}
