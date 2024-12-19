import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CircleUserRound,
  Camera,
  IdCard,
  FileText,
  FileImage,
  IterationCcw,
  Clock,
  CircleCheck,
} from "lucide-react";

export function loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Information Card */}
      {/* DL Details Card Skeleton */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">DL Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-8">
          {/* Left Section: DL Details Skeleton */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 15 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
          </div>

          {/* Right Section: Photo and Signature Skeleton */}
          <div className="flex flex-col items-center gap-10">
            {/* DL Owner Photo Skeleton */}
            <Skeleton className="w-[300px] h-[300px] rounded-lg" />

            {/* Signature Skeleton */}
            <Skeleton className="w-[200px] h-[100px] rounded-lg" />
          </div>
        </CardContent>
      </Card>

      {/* Challan Details Card Skeleton */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Challan Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-full" />
          ))}
        </CardContent>
      </Card>

      {/* Challan Impound Documents Card Skeleton */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Challan Impound Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="w-[250px] h-[250px] rounded-lg" />
          <Skeleton className="w-[250px] h-[250px] rounded-lg" />
          <Skeleton className="w-[250px] h-[250px] rounded-lg" />
        </CardContent>
      </Card>

      {/* Recommendation Card Skeleton */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IterationCcw className="h-5 w-5" />
            Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-center">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default loading;
