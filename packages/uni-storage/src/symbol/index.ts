import type { InjectionKey } from 'vue';
import { StorageInstance } from '../types';

export const storageKey = Symbol('__STORAGE__') as InjectionKey<StorageInstance>;
