import { App } from 'vue';
import { UniStorage } from '../core';

export interface StorageConfig {
  expire: number;
  prefix: string;
  cipher: {
    key: string;
    iv: string;
  };
  enableCipher: boolean;
}

export interface StorageInstance extends UniStorage {
  install(app: App<Element>): void;
}
