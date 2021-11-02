import { createCipheriv, scryptSync } from 'crypto';

export async function encript(what) {
  const iv =  Buffer.alloc(16, 0);
  const password = 'Jeeves';
  // The key length is dependent on the algorithm.
  // In this case for aes256, it is 32 bytes.
  const key = scryptSync(password, 'salt', 32);
  const cipher = createCipheriv('aes-256-ctr', key, iv);
  let encryptedText = cipher.update(what, 'utf8', 'hex');
  encryptedText += cipher.final('hex');
  console.log({
    encripted: encryptedText,
  });
}
