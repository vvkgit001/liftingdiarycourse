import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { NewWorkoutForm } from "./_components/new-workout-form"

export default async function NewWorkoutPage() {
  const { userId } = await auth()
  if (!userId) redirect("/")

  return (
    <div className="container mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">New Workout</h1>
      <NewWorkoutForm />
    </div>
  )
}
