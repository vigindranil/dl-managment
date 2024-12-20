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

const page = () => {
  const [dlNumber, setDlNumber] = useState(""); // Input field state
  const [dlDetails, setDlDetails] = useState(null); // Fetched data state
  const [loading, setLoading] = useState(false); // Loading state
  const authToken = useSelector((state) => state.auth.token);
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const parse_token = decrypt(authToken);
    setToken(parse_token);
  }, [token]);
  console.log(dlNumber);

  const dlOnwerDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${serviceUrl}sarthi/get-dl-details?dl_number=${dlNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const results = await response.json();

        if (results?.status == 0) {
          setDlDetails(results);
          console.log(results);
        } else {
          setError(`${errorData.message}`);
          setDlDetails(null);
        }
      } else {
        const errorData = await response.json();
        setError(`${errorData.message}`);
      }
    } catch (error) {
      console.log(error.message);
      setError(`${errorData.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 bg-gray-50">
      {/* Wrapper for Input and Search Button */}
      <div className="flex gap-4 w-full md:w-1/2 bg-white py-6 px-6 rounded-lg shadow-md">
        {/* Input Field */}
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Enter DL Number"
            value={dlNumber}
            onChange={(e) => setDlNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Search Button */}
        <Button onClick={dlOnwerDetails} disabled={loading || !dlNumber}>
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
      {dlDetails && (
        <div className="w-full px-4 mt-8">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                DL Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-8">
              {/* Left Section: DL Details */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">
                    {dlDetails?.data?.name ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Son/Wife/Daughter of
                  </p>
                  <p className="font-medium">
                    {dlDetails?.data?.fatherName ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">DL Number</p>
                  <p className="font-medium">
                    {dlDetails?.data?.dlno ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">
                    {new Date(dlDetails?.data?.dob ?? "N/A").toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone Number</p>
                  <p className="font-medium">
                    {dlDetails?.data?.mobileNo ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="font-medium">
                    {dlDetails?.data?.bloodGroup ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-medium">
                    {new Date(
                      dlDetails?.data?.issuedt ?? "N/A"
                    ).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    NON-Transport Valid Until
                  </p>
                  <p className="font-medium">
                    {dlDetails?.data?.dlNonTransValdTill ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Transport Valid Until
                  </p>
                  <p className="font-medium">
                    {dlDetails?.data?.dlTransValdTill?.trim()
                      ? dlDetails.data.dlTransValdTill
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">
                    {dlDetails?.data?.gender ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle Class</p>
                  <p className="font-medium">
                    {dlDetails?.data?.vehicleClass.join(", ") ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RTO Code</p>
                  <p className="font-medium">
                    {dlDetails?.data?.authorityCode ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">RTO Name</p>
                  <p className="font-medium">
                    {dlDetails?.data?.authorityName ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Permanent Address
                  </p>
                  <p className="font-medium">
                    {dlDetails?.data?.permAdd1 ?? "N/A"},
                  </p>
                  <p className="font-medium">
                    {dlDetails?.data?.permAdd2 ?? "N/A"},
                  </p>
                  <p className="font-medium">
                    {dlDetails?.data?.permAdd3 ?? "N/A"},
                  </p>
                  <p className="font-medium">
                    {dlDetails?.data?.permPin ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Present Address
                  </p>
                  <p className="font-medium">
                    {dlDetails?.data?.tempAdd1 ?? "N/A"},
                  </p>
                  <p className="font-medium">
                    {dlDetails?.data?.tempAdd2 ?? "N/A"},
                  </p>
                  <p className="font-medium">
                    {dlDetails?.data?.tempAdd3 ?? "N/A"},
                  </p>
                  <p className="font-medium">
                    {dlDetails?.data?.tempPin ?? "N/A"}
                  </p>
                </div>
              </div>

              {/* Right Section: Photo and Signature */}
              <div className="flex flex-col items-center gap-10">
                <p className="text-sm text-muted-foreground">DL Owner Photo</p>
                {/* DL Owner Photo */}
                <div className="w-[300px] h-[300px] flex items-center justify-center rounded-lg">
                  {dlDetails?.data?.photo ? (
                    <Image
                      src={`data:image/png;base64,${dlDetails?.data?.photo}`}
                      alt="Owner Photo"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="text-lg text-black-500">
                      No image available
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground">
                  DL Owner Signature
                </p>
                {/* Signature */}
                <div className="w-[200px] h-[100px] flex items-center justify-center rounded-lg">
                  {dlDetails?.data?.signature ? (
                    <Image
                      src={`data:image/png;base64,${dlDetails?.data?.signature}`}
                      alt="Signature"
                      width={200}
                      height={100}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="text-lg text-black-500">
                      No signature available
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default page;
