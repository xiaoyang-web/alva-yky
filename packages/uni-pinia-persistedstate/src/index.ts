import type { PiniaPluginContext } from 'pinia';
import type { PartialState, PersistStrategy, StorageLike, Store } from './types';
export * from './types';

export function createPersist(storageLike: StorageLike) {
  function updateStorage(strategy: PersistStrategy, store: Store) {
    const storage = strategy.storage || storageLike;
    const storeKey = strategy.key || store.$id;

    if (strategy.paths) {
      const partialState = strategy.paths.reduce((finalObj, key) => {
        finalObj[key] = store.$state[key];
        return finalObj;
      }, {} as PartialState);

      storage.setItem(storeKey, partialState);
    } else {
      storage.setItem(storeKey, store.$state);
    }
  }

  const piniaPersist = ({ options, store }: PiniaPluginContext): void => {
    if (options.persist?.enabled) {
      const defaultStrat: PersistStrategy[] = [
        {
          key: store.$id,
          storage: storageLike
        }
      ];

      const strategies = options.persist?.strategies?.length ? options.persist?.strategies : defaultStrat;

      strategies.forEach((strategy) => {
        const storage = strategy.storage || storageLike;
        const storeKey = strategy.key || store.$id;
        const storageResult = storage.getItem(storeKey);

        if (storageResult) {
          store.$patch(storageResult);
          updateStorage(strategy, store);
        }
      });

      store.$subscribe(() => {
        strategies.forEach((strategy) => {
          updateStorage(strategy, store);
        });
      });
    }
  };

  return piniaPersist;
}
