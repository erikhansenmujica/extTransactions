import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

export async function encript(what) {
  const iv = randomBytes(16);
  const password = 'Password used to generate key';
  // The key length is dependent on the algorithm.
  // In this case for aes256, it is 32 bytes.
  const key = (await promisify(scrypt)(password, 'salt', 32)) as string;
  const cipher = createCipheriv('aes-256-ctr', key, iv);
  const textToEncrypt = what;
  const encryptedText = Buffer.concat([
    cipher.update(textToEncrypt),
    cipher.final(),
  ]);
  console.log(encryptedText)
}
