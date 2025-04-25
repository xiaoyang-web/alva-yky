/**
 * 将字符串转换为短横线命名法（kebab case）
 * 例如："helloWorld" 将被转换为 "hello-world"
 * @param {string} str - 需要转换的字符串
 * @returns {string} 转换后的字符串
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[^a-z0-9]+/gi, '-')
    .toLowerCase()
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}
