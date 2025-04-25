import { kebabCase } from '../kebabCase';

/**
 * 动态生成内联样式，支持字符串、对象和嵌套结构
 * @param {...*} args - 样式参数，支持多种类型和嵌套
 * @returns {string} 生成的内联样式字符串
 */
export function vStyle(...args: unknown[]): string {
  const styleMap = new Map<string, string>();

  const flatten = (inputs: unknown[]): unknown[] => {
    return inputs.reduce<unknown[]>((acc, item) => {
      if (Array.isArray(item)) {
        acc.push(...flatten(item));
      } else if (item != null) {
        acc.push(item);
      }
      return acc;
    }, []);
  };

  const processString = (str: string) => {
    let startPos = 0;
    for (let i = 0; i <= str.length; i++) {
      if (i === str.length || str[i] === ';') {
        const declaration = str.slice(startPos, i).trim();
        startPos = i + 1;
        if (!declaration) continue;
        const colonIdx = declaration.indexOf(':');
        if (colonIdx === -1) continue;
        const rawKey = declaration.slice(0, colonIdx).trim();
        const value = declaration.slice(colonIdx + 1).trim();
        if (rawKey && value) {
          styleMap.set(kebabCase(rawKey), value);
        }
      }
    }
  };

  const processObject = (obj: object) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = (obj as Record<string, unknown>)[key];
        if (value != null) {
          styleMap.set(kebabCase(key), String(value));
        }
      }
    }
  };

  try {
    const flattened = flatten(args);
    for (const item of flattened) {
      if (typeof item === 'string') {
        processString(item);
      } else if (typeof item === 'object' && item !== null) {
        if (Object.prototype.toString.call(item) === '[object Object]') {
          processObject(item);
        }
      }
    }
  } catch (e) {
    console.error('vStyle', e);
    return '';
  }

  const styles: string[] = [];
  styleMap.forEach((v, k) => styles.push(`${k}:${v};`));
  return styles.join(' ');
}
