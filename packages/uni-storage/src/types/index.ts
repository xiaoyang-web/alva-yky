export interface StorageConfig {
  expire: number;
  prefix: string;
  cipher: {
    key: string;
    iv: string;
  };
  enableCipher: boolean;
}

export interface StorageInstance {
  get length(): number;
  clear(): void;
  getItem(key: string): any;
  key(index: number): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: unknown, expire?: number): void;
}
