import type { PiniaPluginContext } from 'pinia';

export interface PersistStrategy {
  key?: string;
  storage?: StorageLike;
  paths?: string[];
}

export interface PersistOptions {
  enabled: true;
  strategies?: PersistStrategy[];
}

export type Store = PiniaPluginContext['store'];

export type PartialState = Partial<Store['$state']>;

export type StorageLike = {
  getItem(key: string): any;
  setItem(key: string, value: any): void;
};

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    persist?: PersistOptions;
  }
}
