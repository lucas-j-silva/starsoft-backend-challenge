/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import http, { CookieJar } from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';
import { Options } from 'k6/options';

// ---------------------------------------------------------------------------
// Configuration via environment variables
// ---------------------------------------------------------------------------
const BASE_URL: string = __ENV.BASE_URL || 'http://localhost:3333';
const SESSION_ID: string =
  __ENV.SESSION_ID || 'aa111111-1111-4111-a111-111111111111';
const VUS: number = parseInt(__ENV.VUS || '5', 10);

// ---------------------------------------------------------------------------
// Seeder users – all created with password "admin123" (see seeders/seeder.ts)
// ---------------------------------------------------------------------------
const SEEDER_USERS = [
  { email: 'alice.johnson@email.com', password: 'admin123' },
  { email: 'bob.smith@email.com', password: 'admin123' },
  { email: 'carol.davis@email.com', password: 'admin123' },
  { email: 'david.martinez@email.com', password: 'admin123' },
  { email: 'emma.wilson@email.com', password: 'admin123' },
];

// ---------------------------------------------------------------------------
// Custom metrics
// ---------------------------------------------------------------------------
const successfulReservations = new Counter('successful_reservations');
const failedReservations = new Counter('failed_reservations');

// ---------------------------------------------------------------------------
// k6 options
// ---------------------------------------------------------------------------
export const options: Options = {
  // Each VU runs exactly one iteration → maximum burst concurrency
  vus: VUS,
  iterations: VUS,
  thresholds: {
    // Exactly one reservation must succeed
    successful_reservations: [`count == 1`],
    // All others must fail
    failed_reservations: [`count == ${VUS - 1}`],
  },
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SetupData {
  sessionTokens: string[];
  sessionSeatId: string;
}

interface SessionSeat {
  id: string;
  isAvailable: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Logs in a user via Better Auth email/password and returns the session
 * cookie value for `better-auth.session_token`.
 */
function login(email: string, password: string): string {
  const jar = new CookieJar();

  const res = http.post(
    `${BASE_URL}/auth/sign-in/email`,
    JSON.stringify({ email, password }),
    {
      headers: {
        'Content-Type': 'application/json',
        'x-testing-env': 'true',
      },
      jar,
    },
  );
  console.log(res.status, res.body?.toString());

  if (res.status !== 200) {
    throw new Error(
      `Login failed for ${email} – HTTP ${res.status}: ${res.body as string} | ${res.body?.toString()}`,
    );
  }

  const cookies = res.cookies['better-auth.session_token'];
  if (!cookies || cookies.length === 0) {
    throw new Error(
      `No session cookie returned for ${email}. Body: ${res.body as string}`,
    );
  }

  return cookies[0].value;
}

/**
 * Fetches all available session seats for the given session.
 * This endpoint is public (no auth required).
 */
function getAvailableSeats(sessionId: string): SessionSeat[] {
  const res = http.get(`${BASE_URL}/sessions/${sessionId}/seats`, {
    headers: { 'x-testing-env': 'true' },
  });

  if (res.status !== 200) {
    throw new Error(
      `Failed to list seats – HTTP ${res.status}: ${res.body as string}`,
    );
  }

  const seats = JSON.parse(res.body as string) as SessionSeat[];
  console.log(seats);
  return seats.filter((s) => s.isAvailable);
}

// ---------------------------------------------------------------------------
// Setup – runs once before VUs start
// ---------------------------------------------------------------------------
export function setup(): SetupData {
  const usersToLogin = SEEDER_USERS.slice(0, VUS);

  console.log(`Logging in ${usersToLogin.length} user(s)…`);
  const sessionTokens = usersToLogin.map((u) => login(u.email, u.password));
  console.log(`All users authenticated.`);

  const availableSeats = getAvailableSeats(SESSION_ID);
  if (availableSeats.length === 0) {
    throw new Error(
      `No available seats found for session ${SESSION_ID}. Run the seeders first.`,
    );
  }

  const sessionSeatId = availableSeats[0].id;
  console.log(`Target session : ${SESSION_ID}`);
  console.log(`Target seat    : ${sessionSeatId}`);
  console.log(`Virtual users  : ${VUS}`);

  return { sessionTokens, sessionSeatId };
}

// ---------------------------------------------------------------------------
// Default function – runs once per VU (all fire concurrently)
// ---------------------------------------------------------------------------
export default function (data: SetupData): void {
  const { sessionTokens, sessionSeatId } = data;

  // Each VU picks its own user's token (cycling if VUS > seeder users)
  const tokenIndex = (__VU - 1) % sessionTokens.length;
  const sessionToken = sessionTokens[tokenIndex];

  const res = http.post(
    `${BASE_URL}/sessions/${SESSION_ID}/seats/${sessionSeatId}/reserve`,
    null,
    {
      headers: {
        Cookie: `better-auth.session_token=${sessionToken}`,
        'Content-Type': 'application/json',
        'x-testing-env': 'true',
      },
    },
  );

  const isSuccess = res.status === 200;

  if (isSuccess) {
    successfulReservations.add(1);
    console.log(
      `VU ${__VU} [user index ${tokenIndex}]: ✓ SUCCESS (${res.status})`,
    );
  } else {
    failedReservations.add(1);
    console.log(
      `VU ${__VU} [user index ${tokenIndex}]: ✗ FAILED (${res.status}) – ${res.body as string}`,
    );
  }

  check(res, {
    'response is 200 (success) or 409 (expected conflict)': (r) =>
      r.status === 200 || r.status === 409,
  });
}
