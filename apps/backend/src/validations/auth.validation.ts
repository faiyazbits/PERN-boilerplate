import {
  ForgotPasswordDtoSchema,
  LoginDtoSchema,
  LogoutDtoSchema,
  RefreshTokensDtoSchema,
  RegisterDtoSchema,
  ResetPasswordDtoSchema,
  TokenQuerySchema,
} from '@haber/shared';

const register = { body: RegisterDtoSchema };

const login = { body: LoginDtoSchema };

const logout = { body: LogoutDtoSchema };

const refreshTokens = { body: RefreshTokensDtoSchema };

const forgotPassword = { body: ForgotPasswordDtoSchema };

const resetPassword = {
  query: TokenQuerySchema,
  body: ResetPasswordDtoSchema,
};

const verifyEmail = { query: TokenQuerySchema };

export default { register, login, logout, refreshTokens, forgotPassword, resetPassword, verifyEmail };
