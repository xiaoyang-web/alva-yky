import { isNil, kebabCase } from '@alva-yky/uni-tools';
import type { StorageConfig } from '../interface';
import { Encryption } from '../encryption';
import StorageError from '../error';

export class UniStorage implements Storage {
  private readonly config: StorageConfig;
  private readonly encipher: Encryption;
  constructor(config: StorageConfig) {
    this.config = config;
    this.encipher = new Encryption(config.cipher.key, config.cipher.iv);
  }

  private getStorageKey(name: string) {
    const { prefix } = this.config;
    const key = !prefix.trim() ? name : `${prefix}-${name}`;
    return kebabCase(key).toUpperCase();
  }

  get length() {
    try {
      return uni.getStorageInfoSync().keys.length;
    } catch (error: any) {
      throw new StorageError({ code: 10002, message: error?.message });
    }
  }

  clear() {
    try {
      uni.clearStorageSync();
    } catch (error: any) {
      throw new StorageError({ code: 10006, message: error?.message });
    }
  }

  getItem(key: string) {
    try {
      const storageValue = uni.getStorageSync(this.getStorageKey(key));
      if (isNil(storageValue)) return null;
      const decryptValue = this.config.enableCipher ? this.encipher.decrypt(storageValue) : storageValue;
      const data = JSON.parse(decryptValue);
      const { value, expire } = data;
      if (!isNil(expire) && expire < new Date().getTime()) {
        this.removeItem(key);
        return null;
      }
      return value;
    } catch (error: any) {
      return new StorageError({ code: 10003, message: error?.message });
    }
  }

  key(index: number) {
    try {
      const name = uni.getStorageInfoSync().keys[index];
      return isNil(name) ? null : name;
    } catch (error: any) {
      throw new StorageError({ code: 10002, message: error?.message });
    }
  }

  removeItem(key: string) {
    try {
      uni.removeStorageSync(this.getStorageKey(key));
    } catch (error: any) {
      throw new StorageError({ code: 10005, message: error?.message });
    }
  }

  setItem(key: string, value: unknown, expire = this.config.expire) {
    try {
      const now = new Date().getTime();
      const stringData = JSON.stringify({
        value,
        time: now,
        expire: !isNil(expire) ? now + expire : null
      });
      const stringifyValue = this.config.enableCipher ? this.encipher.encrypt(stringData) : stringData;
      uni.setStorageSync(this.getStorageKey(key), stringifyValue);
    } catch (error: any) {
      throw new StorageError({ code: 10004, message: error?.message });
    }
  }
}
