import { decrypt, encrypt } from 'crypto-js/aes';
import UTF8, { parse } from 'crypto-js/enc-utf8';
import ECB from 'crypto-js/mode-ecb';
import PKCS7 from 'crypto-js/pad-pkcs7';
import StorageError from '../error';

export class Encryption {
  private readonly key;
  private readonly iv;

  constructor(key: string, iv: string) {
    if (!key || !iv) {
      throw new StorageError({ code: 10000 });
    }
    if (key.length !== 16 || iv.length !== 16) {
      throw new StorageError({ code: 10001 });
    }
    this.key = parse(key);
    this.iv = parse(iv);
  }

  get options() {
    return {
      mode: ECB,
      padding: PKCS7,
      iv: this.iv
    };
  }

  encrypt(value: string) {
    return encrypt(value, this.key, this.options).toString();
  }

  decrypt(value: string) {
    return decrypt(value, this.key, this.options).toString(UTF8);
  }
}
