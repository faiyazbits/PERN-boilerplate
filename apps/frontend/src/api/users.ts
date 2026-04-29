import type { CreateUserDto, PaginatedUsersDto, UpdateUserDto, UserDto } from '@haber/shared';
import { apiClient } from './client';

export interface GetUsersParams {
  name?: string;
  role?: 'user' | 'admin';
  sortBy?: string;
  limit?: number;
  page?: number;
}

export const usersApi = {
  getUsers: (params?: GetUsersParams) => {
    const searchParams = new URLSearchParams();
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) searchParams.append(key, String(value));
      }
    }
    const query = searchParams.toString();
    return apiClient.get<PaginatedUsersDto>(`/v1/users${query ? `?${query}` : ''}`);
  },

  getUser: (userId: string) => apiClient.get<UserDto>(`/v1/users/${userId}`),

  createUser: (data: CreateUserDto) => apiClient.post<UserDto>('/v1/users', data),

  updateUser: (userId: string, data: UpdateUserDto) => apiClient.patch<UserDto>(`/v1/users/${userId}`, data),

  deleteUser: (userId: string) => apiClient.delete<void>(`/v1/users/${userId}`),
};
