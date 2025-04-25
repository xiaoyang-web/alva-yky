import type { DebouncedFunction, DebounceOptions } from './types';

/**
 * 创建一个防抖函数，该函数延迟调用 `func` 直到等待 `wait` 毫秒后。
 * @param {Function} func 要防抖的函数
 * @param {number} [wait=0] 延迟的毫秒数
 * @param {Object} [options={}] 选项对象
 * @param {boolean} [options.leading=false] 是否在延迟开始前调用
 * @param {boolean} [options.trailing=true] 是否在延迟结束后调用
 * @param {number} [options.maxWait] `func` 被调用的最大等待时间
 * @returns {Function} 返回新的防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 0,
  options: DebounceOptions = {}
): DebouncedFunction<T> {
  let lastArgs: Parameters<T> | undefined;
  let lastThis: any;
  let maxWait: number;
  let timerId: ReturnType<typeof setTimeout> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime: number = 0;

  const leading = !!options.leading;
  const trailing = 'trailing' in options ? !!options.trailing : true;
  const maxing = 'maxWait' in options;
  maxWait = maxing ? Math.max(Number(options.maxWait) || 0, wait) : 0;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }

  function shouldInvoke(time: number): boolean {
    if (lastCallTime === undefined) return true;
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    return timeSinceLastCall >= wait || (maxing && timeSinceLastInvoke >= maxWait);
  }

  function invokeFunc(time: number): ReturnType<T> | undefined {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    return func.apply(thisArg, args ?? []);
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime || 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxing ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
  }

  function timerExpired(): void {
    const currentTime = Date.now();
    if (shouldInvoke(currentTime)) {
      return trailingEdge(currentTime);
    }
    timerId = setTimeout(timerExpired, remainingWait(currentTime));
  }

  function leadingEdge(time: number): ReturnType<T> | undefined {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : undefined;
  }

  function trailingEdge(time: number): ReturnType<T> | undefined {
    timerId = undefined;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return undefined;
  }

  function cancel(): void {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush(): ReturnType<T> | undefined {
    return timerId === undefined ? undefined : trailingEdge(Date.now());
  }

  function debounced(this: any, ...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return undefined;
  }

  debounced.cancel = cancel;
  debounced.flush = flush;

  return debounced as DebouncedFunction<T>;
}
