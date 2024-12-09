import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Wifi, WifiOff , CircleArrowRight  } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
          <Card className="border-l-yellow-300 border-l-2">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-slate-500">
                Recommended Suspensions
              </CardTitle>
              <AlertCircle className="w-8 h-8 ml-auto text-yellow-500 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <h1 className="text-5xl font-medium">10</h1>
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                asChild
                className=" bg-stone-100"

              >
                <Link href="/dl-suspensions">show more<CircleArrowRight  className="w-4 h-4 ml-auto text-muted-foreground" /></Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-l-emerald-300 border-l-2">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-slate-500">
                Processed Suspensions
              </CardTitle>
              <CheckCircle2 className="w-8 h-8 ml-auto text-emerald-500" />
            </CardHeader>
            <CardContent>
            <h1 className="text-5xl">35</h1>
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                asChild
                className=" bg-stone-100"
              >
                 <Link href="/dl-suspensions">show more<CircleArrowRight  className="w-4 h-4 ml-auto text-muted-foreground" /></Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
          <Card className="border-l-sky-300 border-l-2">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-slate-500">
                Online Hearings
              </CardTitle>
              <Wifi className="w-8 h-8 ml-auto text-blue-500" />
            </CardHeader>
            <CardContent>
            <h1 className="text-5xl">54</h1>
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                asChild
                className=" bg-stone-100"
              >
                 <Link href="/dl-suspensions">show more<CircleArrowRight  className="w-4 h-4 ml-auto text-muted-foreground" /></Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-l-rose-300 border-l-2">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-slate-500">
                Offline Hearings
              </CardTitle>
              <WifiOff className="w-8 h-8 ml-auto text-red-400" />
            </CardHeader>
            <CardContent>
            <h1 className="text-5xl">24</h1>
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                asChild
                className=" bg-stone-100"
              >
                <Link href="/dl-suspensions">show more<CircleArrowRight  className="w-4 h-4 ml-auto text-muted-foreground" /></Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
    </div>
  );
};

export default page;
