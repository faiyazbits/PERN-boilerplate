import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const UserDtoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
  isEmailVerified: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateUserDtoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  role: z.enum(['user', 'admin']).optional(),
});

export const UpdateUserDtoSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: passwordSchema.optional(),
  })
  .refine((obj) => Object.keys(obj).length > 0, 'At least one field is required');

export const PaginatedUsersDtoSchema = z.object({
  results: z.array(UserDtoSchema),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  totalResults: z.number().int().nonnegative(),
});

export { passwordSchema };

export type UserDto = z.infer<typeof UserDtoSchema>;
export type CreateUserDto = z.infer<typeof CreateUserDtoSchema>;
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
export type PaginatedUsersDto = z.infer<typeof PaginatedUsersDtoSchema>;
