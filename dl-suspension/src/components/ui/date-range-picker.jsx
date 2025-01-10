"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DatePicker({ value, onChange, className, ...props }) {
  const [date, setDate] = React.useState(value ? new Date(value) : null);
  const [currentView, setCurrentView] = React.useState("calendar");
  const [yearRange, setYearRange] = React.useState([
    new Date().getFullYear() - 4,
    new Date().getFullYear() + 5,
  ]);

  const handleSelect = (selectedDate) => {
    if (!selectedDate) return;

    // Normalize the selected date to remove time zone offsets
    const normalizedDate = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    );

    setDate(normalizedDate);
    if (typeof onChange === "function") {
      onChange(normalizedDate);
    }
    setCurrentView("calendar");
  };

  const handleYearChange = (year) => {
    const newDate = new Date(date || new Date());
    newDate.setFullYear(year);
    setDate(newDate);
    setCurrentView("calendar");
  };

  const handleMonthChange = (monthIndex) => {
    const newDate = new Date(date || new Date());
    newDate.setMonth(monthIndex);
    setDate(newDate);
    setCurrentView("calendar");
  };

  const navigateYears = (direction) => {
    const [start, end] = yearRange;
    setYearRange([
      direction === "next" ? start + 10 : start - 10,
      direction === "next" ? end + 10 : end - 10,
    ]);
  };

  const renderYearView = () => (
    <div className="p-2">
      <div className="flex justify-between items-center mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateYears("prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span>
          {yearRange[0]} - {yearRange[1]}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateYears("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 10 }, (_, i) => yearRange[0] + i).map((year) => (
          <Button
            key={year}
            onClick={() => handleYearChange(year)}
            variant="ghost"
            className={cn(
              "w-full",
              date?.getFullYear() === year &&
                "bg-primary text-primary-foreground"
            )}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderMonthView = () => (
    <div className="p-2">
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => (
          <Button
            key={month}
            onClick={() => handleMonthChange(index)}
            variant="ghost"
            className={cn(
              "w-full",
              date?.getMonth() === index && "bg-primary text-primary-foreground"
            )}
          >
            {month}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderCalendarView = () => (
    <DayPicker
      mode="single"
      selected={date}
      onSelect={handleSelect}
      defaultMonth={date || new Date()}
      className={cn("p-3")}
      footer={
        <div className="mt-4 flex justify-center space-x-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setCurrentView("years")}
          >
            {date?.getFullYear() || new Date().getFullYear()}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setCurrentView("months")}
          >
            {months[date?.getMonth() || new Date().getMonth()]}
          </Button>
        </div>
      }
    />
  );

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
          {date ? format(date, "PPP") : <span>Select date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        {currentView === "years" && renderYearView()}
        {currentView === "months" && renderMonthView()}
        {currentView === "calendar" && renderCalendarView()}
      </PopoverContent>
    </Popover>
  );
}
