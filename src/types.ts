import type { Request } from 'express';
import type { IUser } from './models';

export interface AuthRequest extends Request {
  user?: IUser | Express.User;
}

export interface PaginateQuery extends Request {
  query: {
    name?: string;
    role?: string;
    sortBy?: string;
    limit?: string;
    page?: string;
  };
}
