import { Get, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class IHelper {
  constructor(private configService: ConfigService) {}
  getParameter() {}
  getConfigValue(value: string) {
    return this.configService.get<string>(value);
  }
  async getProtectedValue(value: string) {
    const iv = randomBytes(16);
    const password = 'Password used to generate key';
    const key = (await promisify(scrypt)(password, 'salt', 32)) as string;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);
    const decryptedText = Buffer.concat([
      decipher.update(this.configService.get<NodeJS.ArrayBufferView>(value)),
      decipher.final(),
    ]);
    console.log(decryptedText)
    return decryptedText.toString();
  }
}
