"use client";
import React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Adjust import paths
import { FiSearch } from "react-icons/fi";
import { serviceUrl } from "@/app/constant";
import { useSelector } from "react-redux";
import { decrypt } from "@/utils/crypto";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  IdCard,
  Car,
  FileText,
  Clock,
  CircleCheck,
  Camera,
  CircleUserRound,
  IterationCcw,
  FileImage,
} from "lucide-react";

const page = () => {
  const [challanno, setChallanno] = useState(""); // Input field state
  const [apiData, setApiData] = useState(""); // Fetched data state
  const [loading, setLoading] = useState(false); // Loading state
  const authToken = useSelector((state) => state.auth.token);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const userDetails = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const parse_token = decrypt(authToken);
    setToken(parse_token);

    const user_data = JSON.parse(decrypt(userDetails));
    setUser(user_data);
  }, [token]);
  // console.log(dlNumber);

  async function challanSearch() {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      await fetch(
        `${serviceUrl}get-dl-suspension-recommendation-details?RTOCode=${user?.RTOCode}&ChallanNumber=${challanno}&DLStatus=0&RecordRange=0`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setApiData(result.data[0]);
        })
        .catch((error) => setError(`${errorData.message}`));
    } catch (error) {
      setError(`${errorData.message}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 bg-gray-50">
      {/* Wrapper for Input and Search Button */}
      <div className="flex gap-4 w-full md:w-1/2 bg-white py-6 px-6 rounded-lg shadow-md">
        {/* Input Field */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Enter Challan Number"
            value={challanno}
            onChange={(e) => setChallanno(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Search Button */}
        <Button onClick={challanSearch} disabled={loading || !challanno}>
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Fetching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Card for DL Details */}
      {apiData && (
        <div className="w-full px-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Challan Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">DL Number</p>
                  <p className="font-medium">{apiData?.DLNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Challan Number
                  </p>
                  <p className="font-medium">{apiData?.ChallanNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Challan Date and Time
                  </p>
                  <p className="font-medium">
                    {apiData?.ChallanDate
                      ? (() => {
                          const date = new Date(apiData.ChallanDate);
                          const formattedDate = date.toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          );

                          const formattedTime = date
                            .toLocaleTimeString("en-GB", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                            })
                            .toUpperCase();

                          return `${formattedDate} ${formattedTime}`;
                        })()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Challan Place</p>
                  <p className="font-medium">{apiData?.ChallanPlace}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">State Code</p>
                  <p className="font-medium">{apiData?.StateCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Accused Type</p>
                  <p className="font-medium">{apiData?.AccusedType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Officer Name</p>
                  <p className="font-medium">{apiData?.OfficerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Officer Designation
                  </p>
                  <p className="font-medium">{apiData?.OfficerDesignation}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Vehicle Number
                  </p>
                  <p className="font-medium">{apiData?.VehicleNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Accused Name</p>
                  <p className="font-medium">{apiData?.AccusedName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Contact Number
                  </p>
                  <p className="font-medium">{apiData?.ContactNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RTO Name</p>
                  <p className="font-medium">{apiData?.RTOName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RTO Code</p>
                  <p className="font-medium">{apiData?.RTOCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Challan Status
                  </p>
                  <p className="font-medium">
                    {apiData?.ChallanStatus}
                    {apiData?.ChallanStatus === "Pending" ? (
                      <Clock className="w-4 h-4 text-yellow-500 inline ml-2" />
                    ) : (
                      <CircleCheck className="w-4 h-4 text-emerald-500 inline ml-2" />
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{apiData?.Department}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Offence Details
                </p>
                {apiData?.OffenceDetails?.map((offence, index) => (
                  <div key={index} className="mb-2">
                    <p className="font-medium">{offence.OffenceName}</p>
                    <p className="text-sm text-muted-foreground">
                      Act: {offence.OffenceAct}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default page;
