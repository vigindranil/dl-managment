import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const loading = () => {
  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-4">
        <Skeleton className="h-8 w-full" />
      </div>
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex space-x-4">
        <Skeleton className="h-6 w-1/6" />
        <Skeleton className="h-6 w-1/6" />
        <Skeleton className="h-6 w-1/6" />
        <Skeleton className="h-6 w-1/6" />
        <Skeleton className="h-6 w-1/6" />
        <Skeleton className="h-6 w-1/6" />
      </div>
    ))}
  </div>
  );
};

export default loading;
