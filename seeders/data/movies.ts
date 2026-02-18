import { type MovieInsertSchema } from '../../src/modules/movies/schemas/movies.schema';

export const movies: MovieInsertSchema[] = [
  {
    id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
    name: 'Inception',
    description:
      "A skilled thief who steals secrets from deep within the subconscious during dream-sharing technology must plant an idea in a target's mind.",
    createdAt: new Date('2025-01-05T12:00:00.000Z'),
    updatedAt: new Date('2025-01-05T12:00:00.000Z'),
  },
  {
    id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
    name: 'The Dark Knight',
    description:
      'Batman faces the Joker, a criminal mastermind who plunges Gotham City into anarchy and forces the Dark Knight closer to crossing the line.',
    createdAt: new Date('2025-01-05T12:00:00.000Z'),
    updatedAt: new Date('2025-01-05T12:00:00.000Z'),
  },
  {
    id: 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f',
    name: 'Interstellar',
    description:
      "A group of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth becomes uninhabitable.",
    createdAt: new Date('2025-01-06T09:00:00.000Z'),
    updatedAt: new Date('2025-01-06T09:00:00.000Z'),
  },
  {
    id: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8a',
    name: 'Dune: Part Two',
    description:
      'Paul Atreides unites with the Fremen to seek revenge against those who destroyed his family while trying to prevent a terrible future.',
    createdAt: new Date('2025-01-07T15:30:00.000Z'),
    updatedAt: new Date('2025-01-07T15:30:00.000Z'),
  },
  {
    id: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a9b',
    name: 'Spider-Man: Across the Spider-Verse',
    description:
      'Miles Morales embarks on an epic adventure across the multiverse with Gwen Stacy and a new team of Spider-People.',
    createdAt: new Date('2025-01-08T11:00:00.000Z'),
    updatedAt: new Date('2025-01-08T11:00:00.000Z'),
  },
  {
    id: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b0c',
    name: 'Oppenheimer',
    description:
      'The story of J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    createdAt: new Date('2025-01-09T13:00:00.000Z'),
    updatedAt: new Date('2025-01-09T13:00:00.000Z'),
  },
];
