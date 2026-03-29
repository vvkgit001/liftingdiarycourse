"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { updateWorkout } from "@/data/workouts"

const UpdateWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(100),
  date: z.string().date("Invalid date"),
})

export async function updateWorkoutAction(
  workoutId: string,
  name: string,
  date: string
) {
  const {
    workoutId: validId,
    name: validName,
    date: validDate,
  } = UpdateWorkoutSchema.parse({ workoutId, name, date })

  const { userId } = await auth()
  if (!userId) redirect("/")

  const [year, month, day] = validDate.split("-").map(Number)
  const workoutDate = new Date(year, month - 1, day)

  await updateWorkout(userId, validId, validName, workoutDate)

  redirect("/dashboard")
}
