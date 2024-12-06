"use client"
import SidebarLayout from "@/components/sidebar-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Wifi,
  WifiOff,
  CircleArrowRight,
} from "lucide-react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";

const page = () => {
const [token, setToken] = useState("");
  useEffect(() => {
     const storedData = sessionStorage.getItem("token");
     if (storedData) {
      setToken(storedData);
    }
  }, []);
  return (
    <div>
      <SidebarLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-slate-500">
                Recommended Suspensions
              </CardTitle>
              <AlertCircle className="w-8 h-8 ml-auto text-yellow-500" />
            </CardHeader>
            <CardContent>
              {/* <p className="text-sm text-muted-foreground">
                View and manage recommended suspensions.
              </p> */}
              <h1 className="text-5xl font-medium">10</h1>
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild className=" bg-stone-100">
                <Link href="/dl-suspensions">
                  show more {token && token}
                  <CircleArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-slate-500">
                Processed Suspensions
              </CardTitle>
              <CheckCircle2 className="w-8 h-8 ml-auto text-green-600 " />
            </CardHeader>
            <CardContent>
              <h1 className="text-5xl">35</h1>
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild className=" bg-stone-100">
                <Link href="/dl-suspensions">
                  show more
                  <CircleArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-slate-500">
                Online Hearings
              </CardTitle>
              <Wifi className="w-8 h-8 ml-auto text-blue-500 " />
            </CardHeader>
            <CardContent>
              <h1 className="text-5xl">54</h1>
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild className=" bg-stone-100">
                <Link href="/dl-suspensions">
                  show more
                  <CircleArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-lg font-bold text-slate-500">
                Offline Hearings
              </CardTitle>
              <WifiOff className="w-8 h-8 ml-auto text-slate-400 " />
            </CardHeader>
            <CardContent>
              <h1 className="text-5xl">24</h1>
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild className=" bg-stone-100">
                <Link href="/dl-suspensions">
                  show more {}
                  <CircleArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </SidebarLayout>
    </div>
  );
};

export default page;
