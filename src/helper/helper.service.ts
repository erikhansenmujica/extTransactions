import { Get, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDecipheriv, randomBytes, scrypt, scryptSync } from 'crypto';

@Injectable()
export class IHelper {
  constructor(private configService: ConfigService) {}
  getParameter() {}
  getConfigValue(value: string) {
    return this.configService.get<string>(value);
  }
  getProtectedValue(value: string) {
    const encryptedText = this.configService.get<string>(value);
    const password = 'Jeeves';
    const iv2 = Buffer.alloc(16, 0);
    const key2 = scryptSync(password, 'salt', 32);
    const decipher = createDecipheriv('aes-256-ctr', key2, iv2);
    let decryptedText = decipher.update(encryptedText, 'hex', 'utf8');
    decryptedText += decipher.final('utf8');
    return decryptedText;
  }
}
