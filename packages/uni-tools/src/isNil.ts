/**
 * 检查给定值是否为 null 或 undefined
 * @param {*} value - 要检查的值
 * @returns {boolean} 如果值为 null 或 undefined，则返回 true，否则返回 false
 */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}
