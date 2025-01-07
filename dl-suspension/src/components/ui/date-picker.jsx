"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DateTimePicker({ value, onChange, className, ...props }) {
  const [date, setDate] = React.useState(value ? new Date(value) : null);
  const [time, setTime] = React.useState(
    value ? format(new Date(value), "HH:mm") : ""
  );

  // Handle date selection
  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    updateDateTime(selectedDate, time);
  };

  // Handle time input changes
  const handleTimeChange = (event) => {
    setTime(event.target.value);
    updateDateTime(date, event.target.value);
  };

  // Combine date and time into a single Date object
  const updateDateTime = (newDate, newTime) => {
    if (newDate && newTime) {
      const [hours, minutes] = newTime.split(":");
      const updatedDate = new Date(newDate);
      updatedDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      onChange(updatedDate); // Pass the Date object directly
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date && time ? (
            `${format(date, "PPP")} at ${time}`
          ) : (
            <span>Select date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-4 space-y-4">
          {/* Calendar for date selection */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          {/* Time input */}
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4" />
            <Input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="flex-1"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
