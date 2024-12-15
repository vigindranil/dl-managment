import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleUserRound, Camera, IdCard, FileText, FileImage, IterationCcw, Clock, CircleCheck } from "lucide-react";


export function loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
    {/* Personal Information Card */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CircleUserRound className="h-5 w-5" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </CardContent>
    </Card>

    {/* Photo Card */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          DL Owner Photo
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Skeleton className="w-[300px] h-[300px] rounded-lg" />
      </CardContent>
    </Card>

    {/* License Details Card */}
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IdCard className="h-5 w-5" />
          License Details
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </CardContent>
    </Card>

    {/* Challan Details Card */}
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Challan Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </CardContent>
    </Card>

    {/* Challan Impound Documents Card */}
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileImage className="h-5 w-5" />
          Challan Impound Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="w-[300px] h-[300px] rounded-lg" />
        <Skeleton className="w-[300px] h-[300px] rounded-lg" />
        <Skeleton className="w-[300px] h-[300px] rounded-lg" />
      </CardContent>
    </Card>

    {/* Recommendation Card */}
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
  )
}

export default loading
