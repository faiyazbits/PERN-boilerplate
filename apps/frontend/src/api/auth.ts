import type { AuthResponseDto, AuthTokensDto, ForgotPasswordDto, LoginDto, RegisterDto } from '@haber/shared';
import { apiClient } from './client';

export const authApi = {
  register: (data: RegisterDto) => apiClient.post<AuthResponseDto>('/v1/auth/register', data),

  login: (data: LoginDto) => apiClient.post<AuthResponseDto>('/v1/auth/login', data),

  logout: (refreshToken: string) => apiClient.post<void>('/v1/auth/logout', { refreshToken }),

  refreshTokens: (refreshToken: string) => apiClient.post<AuthTokensDto>('/v1/auth/refresh-tokens', { refreshToken }),

  forgotPassword: (data: ForgotPasswordDto) => apiClient.post<void>('/v1/auth/forgot-password', data),

  resetPassword: (token: string, password: string) =>
    apiClient.post<void>(`/v1/auth/reset-password?token=${token}`, { password }),

  sendVerificationEmail: () => apiClient.post<void>('/v1/auth/send-verification-email', {}),

  verifyEmail: (token: string) => apiClient.post<void>(`/v1/auth/verify-email?token=${token}`, {}),
};
