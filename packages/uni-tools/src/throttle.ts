import { debounce } from './debounce';
import type { DebouncedFunction, ThrottleOptions } from './types';

/**
 * 创建一个节流函数，每隔 `wait` 毫秒调用一次 `func`。
 * @param {Function} func 要节流的函数
 * @param {number} [wait=0] 节流的毫秒数
 * @param {Object} [options={}] 选项对象
 * @param {boolean} [options.leading=true] 是否在节流开始前调用
 * @param {boolean} [options.trailing=true] 是否在节流结束后调用
 * @returns {Function} 返回新的节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 0,
  options: ThrottleOptions = {}
): DebouncedFunction<T> {
  const leading = 'leading' in options ? !!options.leading : true;
  const trailing = 'trailing' in options ? !!options.trailing : true;

  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait
  });
}
