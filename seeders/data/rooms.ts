import { type RoomInsertSchema } from '../../src/modules/rooms/schemas/rooms.schema';

export const rooms: RoomInsertSchema[] = [
  {
    id: '11111111-aaaa-4bbb-cccc-dddddddddddd',
    name: 'Room 1',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  {
    id: '22222222-aaaa-4bbb-cccc-dddddddddddd',
    name: 'Room 2',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  {
    id: '33333333-aaaa-4bbb-cccc-dddddddddddd',
    name: 'IMAX Theater',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  },
  {
    id: '44444444-aaaa-4bbb-cccc-dddddddddddd',
    name: 'VIP Room',
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
  },
];
