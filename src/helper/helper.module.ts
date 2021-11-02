import { Module } from '@nestjs/common';
import { IHelper } from './helper.service';
import { ConfigHelper } from './confighelper.service';

@Module({
  providers: [IHelper, ConfigHelper],
  exports: [IHelper, ConfigHelper],
})
export class HelperModule {}
