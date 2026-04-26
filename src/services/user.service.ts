import httpStatus from 'http-status';
import { type IUser, User } from '../models';
import type { PaginateOptions, QueryResult } from '../models/plugins';
import { ApiError } from '../utils/ApiError';

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface Filter {
  name?: string;
  role?: string;
}

const createUser = async (userBody: CreateUserBody): Promise<IUser> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

const queryUsers = async (filter: Filter, options: PaginateOptions): Promise<QueryResult> => {
  const users = await User.paginate(filter, options);
  return users;
};

const getUserById = async (id: string): Promise<IUser | null> => {
  return User.findById(id);
};

const getUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email });
};

const updateUserById = async (userId: string, updateBody: Partial<CreateUserBody>): Promise<IUser> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, user._id as any))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId: string): Promise<IUser> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

export const userService = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
