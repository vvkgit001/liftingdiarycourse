"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatDate } from "@/lib/format-date"
import { cn } from "@/lib/utils"

// Placeholder workout data for UI demonstration
const MOCK_WORKOUTS = [
  {
    id: 1,
    name: "Morning Strength Session",
    exercises: 6,
    duration: "52 min",
    volume: "12,400 kg",
  },
  {
    id: 2,
    name: "Evening Cardio",
    exercises: 3,
    duration: "30 min",
    volume: "—",
  },
]

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [open, setOpen] = useState(false)

  return (
    <div className="container mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      {/* Date picker */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Viewing workouts for
        </p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full justify-start gap-2 sm:w-auto"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {formatDate(date)}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(day) => {
                if (day) {
                  setDate(day)
                  setOpen(false)
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Workout list */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Workouts — {formatDate(date)}
        </h2>

        {MOCK_WORKOUTS.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No workouts logged for this date.
          </p>
        ) : (
          <ul className="space-y-3">
            {MOCK_WORKOUTS.map((workout) => (
              <li key={workout.id}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{workout.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-6 text-sm text-muted-foreground">
                    <span>{workout.exercises} exercises</span>
                    <span>{workout.duration}</span>
                    <span>{workout.volume}</span>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
