import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center px-2",
        caption_label: "text-sm font-medium text-gray-800",
        nav: "space-x-1 flex items-center",        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-white border-0 p-0 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-gray-500 rounded-md w-10 font-normal text-[0.8rem] text-center",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm relative p-0 [&:has([aria-selected])]:rounded-md focus-within:relative focus-within:z-20",        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal text-gray-800 aria-selected:opacity-100 hover:bg-indigo-50 hover:text-indigo-700 transition-colors rounded-full"
        ),
        day_range_end: "day-range-end",        day_selected:
          "bg-indigo-600 text-white hover:bg-indigo-700 hover:text-white focus:bg-indigo-600 focus:text-white rounded-full",
        day_today: "bg-gray-100 text-gray-900 font-bold",
        day_outside:
          "day-outside text-gray-400 opacity-60",
        day_disabled: "text-gray-300 opacity-50",        day_range_middle:
          "aria-selected:bg-indigo-50 aria-selected:text-gray-900",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
