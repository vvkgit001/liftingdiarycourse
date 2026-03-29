"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { createWorkout } from "@/data/workouts"

const CreateWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  date: z.string().date("Invalid date"),
})

export async function createWorkoutAction(name: string, date: string) {
  const { name: validName, date: validDate } = CreateWorkoutSchema.parse({ name, date })

  const { userId } = await auth()
  if (!userId) redirect("/")

  const [year, month, day] = validDate.split("-").map(Number)
  const workoutDate = new Date(year, month - 1, day)

  await createWorkout(userId, validName, workoutDate)

  redirect("/dashboard")
}
