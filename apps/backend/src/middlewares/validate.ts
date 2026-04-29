import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import type { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

interface ValidationSchema {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

const validate = (schema: ValidationSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const errors: string[] = [];

  if (schema.body) {
    const result = schema.body.safeParse(req.body);
    if (!result.success) {
      errors.push(...result.error.issues.map((i) => `body.${i.path.join('.')}: ${i.message}`));
    } else {
      req.body = result.data;
    }
  }

  if (schema.query) {
    const result = schema.query.safeParse(req.query);
    if (!result.success) {
      errors.push(...result.error.issues.map((i) => `query.${i.path.join('.')}: ${i.message}`));
    }
  }

  if (schema.params) {
    const result = schema.params.safeParse(req.params);
    if (!result.success) {
      errors.push(...result.error.issues.map((i) => `params.${i.path.join('.')}: ${i.message}`));
    }
  }

  if (errors.length > 0) {
    return next(new ApiError(httpStatus.BAD_REQUEST, errors.join(', ')));
  }

  return next();
};

export default validate;
