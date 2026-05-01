import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: faker.person.fullName(),
  email: 'userone@test.com',
  password,
  role: 'user',
  isEmailVerified: false,
};

const userTwo = {
  id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  name: faker.person.fullName(),
  email: 'usertwo@test.com',
  password,
  role: 'user',
  isEmailVerified: false,
};

const admin = {
  id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
  name: faker.person.fullName(),
  email: 'admin@test.com',
  password,
  role: 'admin',
  isEmailVerified: false,
};

const insertUsers = async (
  users: Array<{ id: string; name: string; email: string; password: string; role: string; isEmailVerified: boolean }>
) => {
  const { prisma } = await import('../utils/setupTestDB');
  await prisma.user.deleteMany();
  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  }
};

export { admin, insertUsers, userOne, userTwo };
