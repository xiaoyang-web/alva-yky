/**
 * 动态生成类名，支持字符串、数组、对象和嵌套结构
 * @param {...*} args - 类名参数，支持多种类型和嵌套
 * @returns {string} 生成的类名字符串
 */
export function vClass(...args: unknown[]): string {
  const classes: string[] = [];
  const seen = new Set<string>();

  const processString = (str: string) => {
    let start = 0;
    let inToken = false;
    const length = str.length;

    for (let i = 0; i < length; i++) {
      const code = str.charCodeAt(i);

      if (code <= 32) {
        if (inToken) {
          const token = str.slice(start, i).trim();
          if (token && !seen.has(token)) {
            seen.add(token);
            classes.push(token);
          }
          inToken = false;
        }
      } else if (!inToken) {
        start = i;
        inToken = true;
      }
    }

    if (inToken) {
      const token = str.slice(start).trim();
      if (token && !seen.has(token)) {
        seen.add(token);
        classes.push(token);
      }
    }
  };

  const processObject = (obj: object) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key) && (obj as Record<string, unknown>)[key]) {
        if (!seen.has(key)) {
          seen.add(key);
          classes.push(key);
        }
      }
    }
  };

  try {
    const stack: unknown[] = [];

    for (let i = args.length - 1; i >= 0; i--) {
      stack.push(args[i]);
    }

    while (stack.length > 0) {
      const current = stack.pop();

      if (current == null) continue;

      switch (typeof current) {
        case 'string':
          processString(current);
          break;

        case 'object':
          if (Array.isArray(current)) {
            for (let i = current.length - 1; i >= 0; i--) {
              stack.push(current[i]);
            }
          } else {
            processObject(current);
          }
          break;

        case 'function':
          try {
            const result = current();
            stack.push(result);
          } catch (e) {
            console.error('vClass', e);
          }
          break;
      }
    }
  } catch (e) {
    console.error('vClass', e);
    return '';
  }

  return classes.join(' ');
}
