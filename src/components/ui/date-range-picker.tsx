"use client";

import * as React from "react";
import { format, startOfToday } from "date-fns";
import { IconCalendar } from "@tabler/icons-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  disabled?: CalendarProps["disabled"];
}

export function DateRangePicker({
  className,
  date,
  setDate,
  disabled,
}: DateRangePickerProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <IconCalendar className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 md:min-w-[580px]" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={
              date?.from && date.from >= startOfToday()
                ? date.from
                : startOfToday()
            }
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={disabled ?? { before: startOfToday() }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
