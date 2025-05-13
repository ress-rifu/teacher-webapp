import * as React from "react"
import { X, Check, ChevronsUpDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"

const MultiSelect = React.forwardRef(
  ({ className, options, placeholder, selected = [], onChange, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)

    const handleUnselect = (item) => {
      onChange(selected.filter((i) => i !== item))
    }

    const handleSelect = (item) => {
      if (selected.includes(item)) {
        onChange(selected.filter((i) => i !== item))
      } else {
        onChange([...selected, item])
      }
      // Keep the popover open after selection
    }

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-10 bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-400 shadow-sm transition-colors",
              selected.length > 0 ? "text-gray-700" : "text-gray-500",
              className
            )}
            onClick={() => setOpen(!open)}
            {...props}
          >
            <div className="flex gap-1 flex-wrap">
              {selected.length === 0 ? (
                <span>{placeholder}</span>
              ) : (
                <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
                  {selected.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="mr-1 mb-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                    >
                      {options.find((option) => option.value === item)?.label || item}
                      <button
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(item)
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleUnselect(item)
                        }}
                      >
                        <X className="h-3 w-3 text-gray-500 hover:text-gray-700" />
                        <span className="sr-only">Remove {item}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white border border-gray-200 shadow-md" align="start">
          <Command className="w-full">
            <CommandInput placeholder="Search options..." className="h-9 text-gray-700" />
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border border-gray-300",
                      selected.includes(option.value) ? "bg-gray-700 border-gray-700" : "bg-white"
                    )}
                  >
                    {selected.includes(option.value) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <span>{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

MultiSelect.displayName = "MultiSelect"

export { MultiSelect }
