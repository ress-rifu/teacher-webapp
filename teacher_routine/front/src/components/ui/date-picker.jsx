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
            "w-full h-10 justify-start text-left font-normal bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-400 shadow-sm transition-colors",
            !selected && "text-gray-500",
            selected && "text-gray-700",
            className
          )}
          {...props}
        >
          <CalendarIcon className={cn("mr-2 h-4 w-4", selected ? "text-gray-600" : "text-gray-400")} />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>      <PopoverContent className="w-auto p-2 bg-white rounded-md border border-gray-200 shadow-lg" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          initialFocus
          className="rounded-md border-0"
          classNames={{
            day_selected: "bg-gray-700 text-white hover:bg-gray-800",
            day_today: "bg-gray-100 text-gray-900 font-bold",
            day_outside: "text-gray-400 opacity-50",
            day_disabled: "text-gray-300 opacity-50",
            day_hidden: "invisible",
            day: "h-9 w-9 p-0 font-normal hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors",
            day_range_middle: "rounded-none",
            cell: "h-9 w-9 text-center p-0 relative focus-within:relative focus-within:z-20",
            head_cell: "text-gray-500 font-normal text-sm",
            nav_button: "bg-white hover:bg-gray-100 hover:text-gray-700 text-gray-500 transition-colors",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            caption: "flex justify-center py-2 mb-1 relative items-center",
            caption_label: "text-sm font-medium text-gray-700",
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
