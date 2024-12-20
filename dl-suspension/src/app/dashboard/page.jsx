"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Wifi,
  WifiOff,
  CircleArrowRight,
} from "lucide-react";
import Link from "next/link";
import { serviceUrl } from "@/app/constant";
import { useSelector } from "react-redux";
import { decrypt } from "@/utils/crypto";

const page = () => {
  const authToken = useSelector((state) => state.auth.token);
  const [token, setToken] = useState(null);
  const userDetails = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);
  const [dashboardCount, setDashboardCount] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const parse_token = decrypt(authToken);
    setToken(parse_token);

    const user_data = JSON.parse(decrypt(userDetails));
    setUser(user_data);

    token && dashboardCountRto();
  }, [token]);
  console.log(dashboardCount?.data?.NoOfPendingChallan);

  const dashboardCountRto = async () => {
    console.log("hi",token);

    try {
      const response = await fetch(
        `${serviceUrl}get-rto-dashboard-count?rto_code=41`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const decoded_data = await response.json();

        if (decoded_data?.status == 0) {
          setDashboardCount(decoded_data);
          console.log(decoded_data);
        } else {
          setError("User not created");
        }
      } else {
        const errorData = await response.json();
        setError(`${errorData.message}`);
      }
    } catch (error) {
      console.log(error.message);
      setError("Failed to create user, Internal server error");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
        <Card className="border-l-yellow-400 border-l-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-slate-500">
              Recommended Suspensions 
            </CardTitle>
            <AlertCircle className="w-8 h-8 ml-auto text-yellow-500" />
          </CardHeader>
          <CardContent>
            <h1 className="text-5xl font-medium">{dashboardCount?.data?.NoOfPendingChallan}</h1>
          </CardContent>
          <CardFooter>
            <Button variant="link" asChild className=" bg-stone-100">
              <Link href={"/dl-suspensions/1"}>
                show more
                <CircleArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-l-emerald-400 border-l-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-slate-500">
              Processed Suspensions
            </CardTitle>
            <CheckCircle2 className="w-8 h-8 ml-auto text-emerald-500" />
          </CardHeader>
          <CardContent>
            <h1 className="text-5xl">{dashboardCount?.data?.NoChallanProcessed}</h1>
          </CardContent>
          <CardFooter>
            <Button variant="link" asChild className=" bg-stone-100">
              <Link href={"/dl-suspensions/4"}>
                show more
                <CircleArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
        <Card className="border-l-sky-400 border-l-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-slate-500">
              Online Hearings
            </CardTitle>
            <Wifi className="w-8 h-8 ml-auto text-blue-500" />
          </CardHeader>
          <CardContent>
            <h1 className="text-5xl">{dashboardCount?.data?.NoOfOnlineHearing}</h1>
          </CardContent>
          <CardFooter>
            <Button variant="link" asChild className=" bg-stone-100">
              <Link href={"/dl-suspensions/3"}>
                show more
                <CircleArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-l-rose-400 border-l-4">
          <CardHeader className="flex flex-row items-center space-y-0 pb-2">
            <CardTitle className="text-lg font-bold text-slate-500">
              Offline Hearings
            </CardTitle>
            <WifiOff className="w-8 h-8 ml-auto text-red-400" />
          </CardHeader>
          <CardContent>
            <h1 className="text-5xl">{dashboardCount?.data?.NoOfOfflineHearing}</h1>
          </CardContent>
          <CardFooter>
            <Button variant="link" asChild className=" bg-stone-100">
              <Link href={"/dl-suspensions/2"}>
                show more {}
                <CircleArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default page;
