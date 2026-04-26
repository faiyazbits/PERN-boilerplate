const pick = <T, K extends keyof T>(object: T, keys: K[]): Pick<T, K> => {
  return keys.reduce(
    (obj, key) => {
      if (object && Object.hasOwn(object, key)) {
        obj[key] = object[key];
      }
      return obj;
    },
    {} as Pick<T, K>
  );
};

export { pick };
