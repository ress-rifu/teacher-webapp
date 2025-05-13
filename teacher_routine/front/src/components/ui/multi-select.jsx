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
              "w-full justify-between transition-colors min-h-[40px] h-auto py-1",
              selected.length > 0 ? "text-foreground" : "text-muted-foreground",
              className
            )}
            onClick={() => setOpen(!open)}
            {...props}
          >
            <div className="flex gap-1 flex-wrap min-h-[24px] max-h-[120px] overflow-y-auto pr-2">
              {selected.length === 0 ? (
                <span>{placeholder}</span>
              ) : (
                <div className="flex flex-wrap gap-1 w-full">
                  {/* Sort selected items alphabetically by their label */}
                  {[...selected]
                    .sort((a, b) => {
                      const labelA = options.find((option) => option.value === a)?.label || a;
                      const labelB = options.find((option) => option.value === b)?.label || b;
                      return labelA.localeCompare(labelB);
                    })
                    .map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="mr-1 mb-1 px-2 py-0.5 flex-shrink-0"
                    >
                      {options.find((option) => option.value === item)?.label || item}
                      <button
                        className="ml-1.5 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
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
        <PopoverContent className="w-full p-0" align="start">
          <Command className="w-full">
            <CommandInput placeholder="Search options..." className="h-10 px-3" />
            <CommandEmpty className="py-6">No options found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto p-1">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  className="flex items-center gap-2 px-3 py-1.5"
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border",
                      selected.includes(option.value) ? "bg-primary border-primary" : "bg-background border-input"
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
