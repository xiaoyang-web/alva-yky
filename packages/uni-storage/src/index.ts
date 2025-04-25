import { inject, type App } from 'vue';
import type { StorageConfig, StorageInstance } from './types';
import { UniStorage } from './core';
import { storageKey } from './symbol';
export * from './types';
export * from './core';

const STORAGE_DEFAULT_CONFIG: Readonly<StorageConfig> = Object.freeze({
  expire: 30 * 24 * 60 * 60 * 1000,
  prefix: 'uni-storage',
  cipher: {
    key: '^beP^H!Z!qea%T1P',
    iv: '1dV@B#CEz7WWJLNn'
  },
  enableCipher: false
});

export function createStorage(config?: Partial<StorageConfig>): StorageInstance {
  const storage = new UniStorage({ ...STORAGE_DEFAULT_CONFIG, ...config });
  const result: StorageInstance = {
    get length() {
      return storage.length;
    },
    clear: storage.clear,
    getItem: storage.getItem,
    key: storage.key,
    removeItem: storage.removeItem,
    setItem: storage.setItem
  };

  return {
    ...result,
    install(app: App<Element>) {
      app.config.globalProperties.$storage = result;
      app.provide(storageKey, result);
    }
  } as StorageInstance;
}

export function useStorage(): StorageInstance {
  const storage = inject(storageKey);
  if (storage) {
    return storage;
  } else {
    throw new Error(
      'uni-storage 只可以在 Vue 上下文中使用，请确保你已经正确地注册了 "uni-storage" 并且当前正处于 Vue 上下文中'
    );
  }
}
