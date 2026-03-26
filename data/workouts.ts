import { db } from "@/db";
import { workouts, workout_exercises } from "@/db/schema";
import { eq, and, gte, lt, count } from "drizzle-orm";

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
        gte(workouts.createdAt, start),
        lt(workouts.createdAt, end)
      )
    )
    .groupBy(workouts.id);

  return rows;
}
