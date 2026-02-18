import { type SessionInsertSchema } from '../../src/modules/sessions/core/schemas/sessions.schema';

export const sessions: SessionInsertSchema[] = [
  {
    id: 'aa111111-1111-4111-a111-111111111111',
    movieId: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    roomId: '11111111-aaaa-4bbb-cccc-dddddddddddd',
    valuePerSeatInCents: 2500,
    startTime: new Date('2025-03-15T19:00:00.000Z'),
    createdAt: new Date('2025-01-15T10:00:00.000Z'),
  },
  {
    id: 'aa222222-2222-4222-a222-222222222222',
    movieId: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    roomId: '22222222-aaaa-4bbb-cccc-dddddddddddd',
    valuePerSeatInCents: 2500,
    startTime: new Date('2025-03-15T20:30:00.000Z'),
    createdAt: new Date('2025-01-15T10:00:00.000Z'),
  },
  {
    id: 'aa333333-3333-4333-a333-333333333333',
    movieId: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    roomId: '33333333-aaaa-4bbb-cccc-dddddddddddd',
    valuePerSeatInCents: 3500,
    startTime: new Date('2025-03-16T15:00:00.000Z'),
    createdAt: new Date('2025-01-16T09:00:00.000Z'),
  },
  {
    id: 'aa444444-4444-4444-a444-444444444444',
    movieId: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    roomId: '44444444-aaaa-4bbb-cccc-dddddddddddd',
    valuePerSeatInCents: 5000,
    startTime: new Date('2025-03-16T21:00:00.000Z'),
    createdAt: new Date('2025-01-16T09:00:00.000Z'),
  },
  {
    id: 'aa555555-5555-4555-a555-555555555555',
    movieId: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
    roomId: '11111111-aaaa-4bbb-cccc-dddddddddddd',
    valuePerSeatInCents: 2000,
    startTime: new Date('2025-03-17T14:00:00.000Z'),
    createdAt: new Date('2025-01-17T08:00:00.000Z'),
  },
  {
    id: 'aa666666-6666-4666-a666-666666666666',
    movieId: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
    roomId: '33333333-aaaa-4bbb-cccc-dddddddddddd',
    valuePerSeatInCents: 3500,
    startTime: new Date('2025-03-17T19:30:00.000Z'),
    createdAt: new Date('2025-01-17T08:00:00.000Z'),
  },
];
