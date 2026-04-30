import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import faker from 'faker';

const prisma = new PrismaClient();

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  id: crypto.randomUUID(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const userTwo = {
  id: crypto.randomUUID(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'user',
  isEmailVerified: false,
};

const admin = {
  id: crypto.randomUUID(),
  name: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

const insertUsers = async (
  users: Array<{ id: string; name: string; email: string; password: string; role: string; isEmailVerified: boolean }>
) => {
  const data = users.map((user) => ({ ...user, password: hashedPassword }));
  await prisma.user.createMany({ data });
};

export { admin, insertUsers, userOne, userTwo };
