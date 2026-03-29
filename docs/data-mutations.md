# Data Mutations Standards

## CRITICAL: Server Actions Only

**ALL data mutations MUST be done exclusively via Next.js Server Actions.**

Do NOT mutate data via:
- Route handlers (`app/api/` endpoints)
- Client-side `fetch` calls
- Direct database calls from components or pages

## Server Actions in Colocated `actions.ts` Files

**ALL server actions MUST live in a colocated `actions.ts` file** next to the page or component they serve.

```
app/
  dashboard/
    create-workout/
      page.tsx
      actions.ts   ← server actions live here
```

Every `actions.ts` file MUST have `"use server"` at the top.

## Database Mutations via `/data` Helpers

**ALL database mutations MUST go through helper functions in the `/data` directory.**

- Never write raw SQL strings. Always use Drizzle ORM.
- Never call the database directly from a server action — always delegate to a `/data` helper.

### Example structure

```
data/
  workouts.ts
  exercises.ts
  users.ts
```

### Example `/data` helper

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date }).returning();
}
```

## Typed Params — No `FormData`

**ALL server action parameters MUST be typed.** `FormData` is NOT an acceptable parameter type.

Extract and validate values before passing them to a server action.

### Wrong — untyped FormData

```ts
// NEVER do this
export async function createWorkout(formData: FormData) {
  const name = formData.get("name");
  // ...
}
```

### Correct — typed params

```ts
export async function createWorkout(name: string, date: string) {
  // ...
}
```

## Zod Validation

**ALL server actions MUST validate their arguments with Zod** before performing any work.

Define a Zod schema for every server action's input and call `.parse()` or `.safeParse()` at the top of the function body.

### Example `actions.ts`

```ts
"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { createWorkout } from "@/data/workouts";

const CreateWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.string().date(),
});

export async function createWorkoutAction(name: string, date: string) {
  const { name: validName, date: validDate } = CreateWorkoutSchema.parse({ name, date });

  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");

  return createWorkout(session.user.id, validName, validDate);
}
```

## CRITICAL: User Data Isolation

**A logged-in user MUST only ever be able to mutate their own data.**

Every server action that modifies user-specific data MUST:

1. Retrieve the `userId` from the authenticated session — never from params or request bodies.
2. Pass that `userId` to the `/data` helper to scope the mutation.
3. Never trust a `userId` supplied by the caller.

### Correct — userId always comes from the session

```ts
const session = await auth();
if (!session?.user?.id) throw new Error("Unauthenticated");

await deleteWorkout(session.user.id, workoutId);
```

### Wrong — never trust a caller-supplied userId

```ts
// NEVER do this — caller can impersonate any user
export async function deleteWorkoutAction(userId: string, workoutId: string) {
  await deleteWorkout(userId, workoutId);
}
```

Failure to scope mutations to the authenticated user is a **security vulnerability** and must never be merged.
