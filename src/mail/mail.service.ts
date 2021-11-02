import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigHelper } from 'src/helper/confighelper.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private helper: ConfigHelper,
  ) {}

  public sendErrorMail(error: string, subject:string, mailReceiver:string): void {
    this.mailerService
      .sendMail({
        to: mailReceiver, // list of receivers
        from: this.helper.getMailSender(), // sender address
        subject: subject, // Subject line
        text: error, // plaintext body
        html: `<b>${error}</b>`, // HTML body content
      })
      .then(() => {
        console.log('email sent');
      })
      .catch((err) => {
        console.log('error: ' + err);
      });
  }
}
