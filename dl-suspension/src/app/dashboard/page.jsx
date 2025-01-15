"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  CheckCircle2,
  Wifi,
  WifiOff,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { serviceUrl } from "@/app/constant";
import { decrypt } from "@/utils/crypto";

const DashboardPage = () => {
  const authToken = useSelector((state) => state.auth.token);
  const userDetails = useSelector((state) => state.auth.user);
  const [dashboardCount, setDashboardCount] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  // const encryptedToken = sessionStorage.getItem("token");

  useEffect(() => {
    const parse_token = authToken;
    setToken(parse_token);
    const userData = JSON.parse(decrypt(userDetails));
    token && dashboardCountRto(userData?.RTOCode);
  }, [userDetails, token]);

  const dashboardCountRto = async (rtoCode) => {
    try {
      const response = await fetch(
        `${serviceUrl}get-rto-dashboard-count?rto_code=${rtoCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const decodedData = await response.json();
        if (decodedData?.status === 0) {
          setDashboardCount(decodedData.data);
        } else {
          setError("Failed to fetch dashboard data");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error(error);
      setError("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  const DashboardCard = ({
    title,
    count,
    day,
    icon: Icon,
    color,
    link,
    description,
    total,
    totalCount,
  }) => (
    <Card
      className={`border-l-4 border-l-${color}-400 hover:shadow-lg transition-shadow`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold text-slate-700">
          {title} <span className="block text-sm text-slate-400">{day}</span>
        </CardTitle>
        <Icon className={`w-8 h-8 text-${color}-500`} />
      </CardHeader>
      <CardContent>
        <div className="text-5xl font-bold mb-2">{count}</div>

        <div className="flex justify-between">
          <Button
            variant="secondary"
            asChild
            className="w-auto justify-between hover:bg-slate-100"
          >
            <Link href={`${link}/1`}>
              View details
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            variant="link"
            asChild
            className="w-auto  justify-between text-xs"
          >
            <Link href={`${link}/0`}>{`${total} : ${totalCount}`}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">RTO Dashboard</h1>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-l-4 border-l-gray-200">
              <CardHeader>
                <Skeleton className="h-4 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-[100px]" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-slate-500 mb-0">
            Recommendated Challan Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 border-b-[3px] py-4 mb-4">
            <DashboardCard
              title="Review Pending Suspensions"
              count={dashboardCount?.NoOfPendingChallanOneWeek || 0}
              day="(Last 7 Days)"
              icon={AlertTriangle}
              color="yellow"
              link="/dl-suspensions/1"
              description="Pending cases requiring attention"
              total="Total (Archived)"
              totalCount={dashboardCount?.NoOfPendingChallan || 0}
            />
            <DashboardCard
              title="Disposed Suspensions"
              count={dashboardCount?.NoChallanProcessedOneWeek || 0}
              icon={CheckCircle2}
              day="(Last 7 Days)"
              color="emerald"
              link="/dl-suspensions/4"
              description="Successfully processed cases"
              total="Total (Archived)"
              totalCount={dashboardCount?.NoChallanProcessed || 0}
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-500 mb-4">
            Hearing Details
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <DashboardCard
              title="Scheduled Online Hearings"
              count={dashboardCount?.NoOfOnlineHearingOneWeek || 0}
              day="(Today)"
              icon={Wifi}
              color="sky"
              link="/dl-suspensions/3"
              description="Scheduled virtual hearings"
              total="Total (Archived)"
              totalCount={dashboardCount?.NoOfOnlineHearing || 0}
            />
            <DashboardCard
              title="Offline Hearings"
              count={dashboardCount?.NoOfOfflineHearingOneWeek || 0}
              day="(Today)"
              icon={WifiOff}
              color="rose"
              link="/dl-suspensions/2"
              total="Total (Archived)"
              totalCount={dashboardCount?.NoOfOfflineHearing || 0}
              description="In-person hearing appointments"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
