import Link from "next/link"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "./_components/date-picker"
import { getWorkoutsForUserByDate } from "@/data/workouts"
import { formatDate } from "@/lib/format-date"

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { userId } = await auth()
  if (!userId) redirect("/")

  const { date: dateParam } = await searchParams
  const date = dateParam
    ? (() => {
        const [year, month, day] = dateParam.split("-").map(Number)
        return new Date(year, month - 1, day)
      })()
    : new Date()

  const workouts = await getWorkoutsForUserByDate(userId, date)

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      {/* Date picker */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Viewing workouts for
        </p>
        <DatePicker selected={date} />
      </div>

      {/* Workout list */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Workouts — {formatDate(date)}</h2>
          <Link
            href="/dashboard/workout/new"
            className="inline-flex h-7 items-center justify-center rounded-lg bg-primary px-2.5 text-[0.8rem] font-medium text-primary-foreground transition-all"
          >
            Log workout
          </Link>
        </div>

        {workouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No workouts logged for this date.
          </p>
        ) : (
          <ul className="space-y-3">
            {workouts.map((workout) => {
              const durationMin =
                workout.startedAt && workout.completedAt
                  ? Math.round(
                      (workout.completedAt.getTime() - workout.startedAt.getTime()) /
                        60_000
                    )
                  : null

              return (
                <li key={workout.id}>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {workout.name ?? "Unnamed Workout"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-6 text-sm text-muted-foreground">
                      <span>{workout.exerciseCount} exercises</span>
                      {durationMin !== null && <span>{durationMin} min</span>}
                    </CardContent>
                  </Card>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
