import { type UserSchema } from '../../src/modules/auth/schemas/auth.schema';

type UserSeed = Omit<UserSchema, 'createdAt' | 'updatedAt'> & {
  createdAt: Date;
  updatedAt: Date;
};

export const users: UserSeed[] = [
  {
    id: 'u_2kF8gR4mN7pQ1sT6vX9yB3',
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    emailVerified: true,
    image: null,
    createdAt: new Date('2025-01-10T08:30:00.000Z'),
    updatedAt: new Date('2025-01-10T08:30:00.000Z'),
  },
  {
    id: 'u_5dH2jL6nP0rS4uW8zA1cE7',
    name: 'Bob Smith',
    email: 'bob.smith@email.com',
    emailVerified: true,
    image: null,
    createdAt: new Date('2025-01-12T14:15:00.000Z'),
    updatedAt: new Date('2025-01-12T14:15:00.000Z'),
  },
  {
    id: 'u_9fK3lM7oQ1sU5wY2bD6gH0',
    name: 'Carol Davis',
    email: 'carol.davis@email.com',
    emailVerified: false,
    image: null,
    createdAt: new Date('2025-02-01T10:00:00.000Z'),
    updatedAt: new Date('2025-02-01T10:00:00.000Z'),
  },
  {
    id: 'u_4eJ8kN2pR6tV0xB3dF7hL1',
    name: 'David Martinez',
    email: 'david.martinez@email.com',
    emailVerified: true,
    image: null,
    createdAt: new Date('2025-02-05T16:45:00.000Z'),
    updatedAt: new Date('2025-02-05T16:45:00.000Z'),
  },
  {
    id: 'u_7gM1nQ5sU9wA3cE6hK0lP4',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    emailVerified: true,
    image: null,
    createdAt: new Date('2025-02-10T09:20:00.000Z'),
    updatedAt: new Date('2025-02-10T09:20:00.000Z'),
  },
];
