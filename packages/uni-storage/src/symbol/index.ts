import type { InjectionKey } from 'vue';
import type { UniStorage } from '../core';

export const storageKey = Symbol('__STORAGE__') as InjectionKey<UniStorage>;
