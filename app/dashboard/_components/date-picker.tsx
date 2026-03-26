"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formatDate } from "@/lib/format-date"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  selected: Date
}

export function DatePicker({ selected }: DatePickerProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  function handleSelect(day: Date | undefined) {
    if (!day) return
    const iso = [
      day.getFullYear(),
      String(day.getMonth() + 1).padStart(2, "0"),
      String(day.getDate()).padStart(2, "0"),
    ].join("-")
    router.push(`/dashboard?date=${iso}`)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-start gap-2 sm:w-auto"
        )}
      >
        <CalendarIcon className="h-4 w-4" />
        {formatDate(selected)}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
