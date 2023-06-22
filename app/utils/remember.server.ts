export function remember<T>(key: string, value: T) {
    const g = global as any;
    g.__singletons ??= {};
    g.__singletons[key] ??= value;
    return g.__singletons[key];
  }
  