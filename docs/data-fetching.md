# Data Fetching Standards

## CRITICAL: Server Components Only

**ALL data fetching MUST be done exclusively via React Server Components.**

Do NOT fetch data via:
- Route handlers (`app/api/` endpoints)
- Client components (`"use client"`)
- `useEffect` / `fetch` on the client
- SWR, React Query, or any client-side data fetching library

If you need data in a client component, fetch it in a server component parent and pass it down as props.

## Database Queries via `/data` Helpers

**ALL database queries MUST go through helper functions in the `/data` directory.**

- Never write raw SQL strings. Always use Drizzle ORM.
- Never query the database directly from a page or component — always call a `/data` helper.

### Example structure

```
data/
  workouts.ts
  exercises.ts
  users.ts
```

### Example helper

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Example usage in a server component

```tsx
// app/dashboard/page.tsx
import { getWorkoutsForUser } from "@/data/workouts";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);
  // ...
}
```

## CRITICAL: User Data Isolation

**A logged-in user MUST only ever be able to access their own data.**

Every `/data` helper that returns user-specific data MUST:

1. Accept a `userId` parameter.
2. Filter all queries by that `userId` using a `where` clause.
3. Never return data belonging to any other user.

The `userId` passed to helpers must always come from the authenticated session — never from URL params, query strings, or request bodies without verification.

### Correct — always scope to the authenticated user

```ts
export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

### Wrong — never expose unscoped queries

```ts
// NEVER do this — returns all users' data
export async function getAllWorkouts() {
  return db.select().from(workouts);
}
```

Failure to scope queries to the authenticated user is a **security vulnerability** and must never be merged.
