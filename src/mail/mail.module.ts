import * as path from 'path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [MailerModule.forRoot()],
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
