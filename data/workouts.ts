import { db } from "@/db";
import { workouts, workout_exercises } from "@/db/schema";
import { eq, and, gte, lt, count } from "drizzle-orm";

export async function getWorkoutById(userId: string, workoutId: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.user_id, userId)));
  return workout ?? null;
}

export async function updateWorkout(
  userId: string,
  workoutId: string,
  name: string,
  date: Date
) {
  const [workout] = await db
    .update(workouts)
    .set({ name, startedAt: date })
    .where(and(eq(workouts.id, workoutId), eq(workouts.user_id, userId)))
    .returning();
  return workout;
}

export async function createWorkout(userId: string, name: string, date: Date) {
  const [workout] = await db
    .insert(workouts)
    .values({ user_id: userId, name, startedAt: date })
    .returning();
  return workout;
}

export async function getWorkoutsForUserByDate(userId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const rows = await db
    .select({
      id: workouts.id,
      name: workouts.name,
      startedAt: workouts.startedAt,
      completedAt: workouts.completedAt,
      exerciseCount: count(workout_exercises.id),
    })
    .from(workouts)
    .leftJoin(workout_exercises, eq(workout_exercises.workout_id, workouts.id))
    .where(
      and(
        eq(workouts.user_id, userId),
        gte(workouts.startedAt, start),
        lt(workouts.startedAt, end)
      )
    )
    .groupBy(workouts.id);

  return rows;
}
