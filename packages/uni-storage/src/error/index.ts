export const STORAGE_ERRORS = new Map<number, string>([
  [0, '正常'],
  [10000, '加密key或者iv为空'],
  [10001, '加密key或者iv格式错误，应该为 16 位字符串'],
  [10002, '获取当前缓存失败'],
  [10003, '获取指定 key 缓存失败'],
  [10004, '设置指定 key 缓存失败'],
  [10005, '删除指定 key 缓存失败'],
  [10006, '清空当前缓存失败'],
  [99999, '未知的缓存错误']
]);

class StorageError extends Error {
  public readonly code: number;

  constructor(options: { code?: number; message?: string } = {}) {
    const errorCode = options.code ?? 99999;
    const message = options.message ?? STORAGE_ERRORS.get(errorCode) ?? STORAGE_ERRORS.get(99999)!;
    super(message);
    this.name = 'StorageError';
    this.code = errorCode;
  }
}

export default StorageError;
