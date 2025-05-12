import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function DatePicker({
  className,
  selected,
  onSelect,
  placeholder = "Pick a date",
  ...props
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full h-10 justify-start text-left font-normal bg-white",
            !selected && "text-gray-500",
            selected && "text-gray-800",
            className
          )}
          {...props}
        >
          <CalendarIcon className={cn("mr-2 h-4 w-4", selected ? "text-indigo-600" : "text-gray-400")} />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white rounded-lg" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
          className="rounded-md border shadow-lg"
          classNames={{
            day_selected: "bg-indigo-600 text-white hover:bg-indigo-700",
            day_today: "bg-gray-100 text-gray-900",
            day_outside: "text-gray-300 opacity-50",
            day_disabled: "text-gray-300",
            day_hidden: "invisible",
            day: "h-9 w-9 p-0 font-normal",
            day_range_middle: "rounded-none",
            cell: "h-9 w-9 text-center p-0 relative focus-within:relative focus-within:z-20",
            head_cell: "text-gray-500 font-medium",
            nav_button: "bg-white hover:bg-gray-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            caption: "flex justify-center py-2 mb-1 relative items-center",
            caption_label: "text-sm font-medium text-gray-900",
            table: "border-collapse space-y-1 mx-auto",
            head_row: "flex",
            row: "flex w-full mt-2",
            month_selector: "relative grid"
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export { DatePicker }
