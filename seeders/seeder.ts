import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { account, user } from '../src/modules/auth/schemas/auth.schema';
import { moviesTable } from '../src/modules/movies/schemas/movies.schema';
import { roomsTable } from '../src/modules/rooms/schemas/rooms.schema';
import { seatsTable } from '../src/modules/rooms/schemas/seats.schema';
import { sessionsTable } from '../src/modules/sessions/core/schemas/sessions.schema';
import { users } from './data/users';
import { movies } from './data/movies';
import { rooms } from './data/rooms';
import { seats } from './data/seats';

import { sessions } from './data/sessions';
import { hashPassword } from 'better-auth/crypto';
import { eq } from 'drizzle-orm';
import { sessionSeatsTable } from 'src/modules/sessions/seats/schemas';

async function seed() {
  const db = drizzle(process.env.DATABASE_URL!);

  console.log('Seeding database...\n');

  // 1. Users (no FKs)
  await db
    .insert(user)
    .values(users)
    .onConflictDoUpdate({
      target: user.id,
      set: {
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        updatedAt: user.updatedAt,
      },
    });
  console.log(`✓ Seeded ${users.length} users`);

  const defaultPasswordHash = await hashPassword('admin123');

  await db
    .insert(account)
    .values(
      users.map(
        (user) =>
          ({
            id: crypto.randomUUID(),
            accountId: user.id,
            userId: user.id,
            password: defaultPasswordHash,
            providerId: 'credential',
          }) satisfies typeof account.$inferInsert,
      ),
    )
    .onConflictDoNothing();

  // 2. Movies (no FKs)
  await db
    .insert(moviesTable)
    .values(movies)
    .onConflictDoUpdate({
      target: moviesTable.id,
      set: {
        name: moviesTable.name,
        description: moviesTable.description,
        updatedAt: moviesTable.updatedAt,
      },
    });
  console.log(`✓ Seeded ${movies.length} movies`);

  // 3. Rooms (no FKs)
  await db
    .insert(roomsTable)
    .values(rooms)
    .onConflictDoUpdate({
      target: roomsTable.id,
      set: {
        name: roomsTable.name,
      },
    });
  console.log(`✓ Seeded ${rooms.length} rooms`);

  // 4. Seats (FK → rooms)
  await db
    .insert(seatsTable)
    .values(seats)
    .onConflictDoUpdate({
      target: seatsTable.id,
      set: {
        roomId: seatsTable.roomId,
        row: seatsTable.row,
        column: seatsTable.column,
      },
    });
  console.log(`✓ Seeded ${seats.length} seats`);

  // 5. Sessions (FK → movies, rooms)
  const allSessions = await db
    .insert(sessionsTable)
    .values(sessions)
    .onConflictDoUpdate({
      target: sessionsTable.id,
      set: {
        movieId: sessionsTable.movieId,
        roomId: sessionsTable.roomId,
        valuePerSeatInCents: sessionsTable.valuePerSeatInCents,
        startTime: sessionsTable.startTime,
      },
    })
    .returning();
  console.log(`✓ Seeded ${allSessions.length} sessions`);

  for (const session of allSessions) {
    const seats = await db
      .select()
      .from(seatsTable)
      .where(eq(seatsTable.roomId, session.roomId));

    await db
      .insert(sessionSeatsTable)
      .values(
        seats.map(
          (seat) =>
            ({
              seatId: seat.id,
              sessionId: session.id,
            }) satisfies typeof sessionSeatsTable.$inferInsert,
        ),
      )
      .onConflictDoUpdate({
        target: [sessionSeatsTable.seatId, sessionSeatsTable.sessionId],
        set: {
          isAvailable: true,
          soldAt: null,
          userId: null,
        },
      });
  }

  console.log('\nSeeding complete!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
