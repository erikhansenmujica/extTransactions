import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigHelper } from 'src/helper/confighelper.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private helper: ConfigHelper,
  ) {}

  public sendErrorMail(error: string): void {
    this.mailerService
      .sendMail({
        to: this.helper.getMailReceiver(), // list of receivers
        from: this.helper.getMailSender(), // sender address
        subject: 'Error with transaction', // Subject line
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
