import { notFound, redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { getWorkoutById } from "@/data/workouts"
import { EditWorkoutForm } from "./_components/edit-workout-form"

interface EditWorkoutPageProps {
  params: Promise<{ workoutId: string }>
}

export default async function EditWorkoutPage({ params }: EditWorkoutPageProps) {
  const { userId } = await auth()
  if (!userId) redirect("/")

  const { workoutId } = await params
  const workout = await getWorkoutById(userId, workoutId)
  if (!workout) notFound()

  return (
    <div className="container mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Edit Workout</h1>
      <EditWorkoutForm
        workoutId={workout.id}
        defaultName={workout.name ?? ""}
        defaultDate={workout.startedAt ?? new Date()}
      />
    </div>
  )
}
