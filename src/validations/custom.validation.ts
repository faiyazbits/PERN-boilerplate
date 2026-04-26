import type { CustomHelpers } from 'joi';

const objectId = (value: string, _helpers: CustomHelpers): string => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value: string, _helpers: CustomHelpers): string => {
  if (value.length < 8) {
    throw new Error('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    throw new Error('password must contain at least 1 letter and 1 number');
  }
  return value;
};

export { objectId, password };
