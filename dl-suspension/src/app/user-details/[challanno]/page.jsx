"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { serviceUrl } from "@/app/constant";
import { useSelector } from "react-redux";
import { decrypt } from "@/utils/crypto";

const Page = ({ challanno }) => {
  const authToken = useSelector((state) => state.auth.token);
  const [token, setToken] = useState(null);
  const userDetails = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);

  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const parse_token = decrypt(authToken);
    setToken(parse_token);

    const user_data = JSON.parse(decrypt(userDetails));
    setUser(user_data);
    token && dlSuspensionRecommendedViewUser();
  }, [token]);
  console.log(token);
  console.log(user);
  console.log("log:", apiData);

  async function dlSuspensionRecommendedViewUser() {
    console.log("hii");

    try {
      const myHeaders = new Headers();
      console.log("token: ", token);
      myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      await fetch(
        `${serviceUrl}get-dl-suspension-recommendation-details?RTOCode=WB-07&ChallanNumber=${challanno}&DLStatus=0`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log("api:", result.data);
          setApiData(result.data[0]);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Challan Details</h1>

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
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{apiData?.AccusedName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">DL Number</p>
              <p className="font-medium">{apiData?.DLNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">
                {new Date(apiData?.DLDateOfBirth).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{apiData?.ContactNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{apiData?.DLPresentAddress}</p>
            </div>
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
            <Image
              src={apiData?.photoUrl || "/assets/img/default-user.png"} // Correct path to default image
              alt="DL Owner"
              width={300}
              height={300}
              className="rounded-lg"
            />
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
            <div>
              <p className="text-sm text-muted-foreground">DL Number</p>
              <p className="font-medium">{apiData?.DLNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Driver Name</p>
              <p className="font-medium">{apiData?.DLDriverName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Relation Name</p>
              <p className="font-medium">{apiData?.DLRelationName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Present Address</p>
              <p className="font-medium">{apiData?.DLPresentAddress}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Permanent Address</p>
              <p className="font-medium">{apiData?.DLPermanentAddress}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">
                {new Date(apiData?.DLDateOfBirth).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blood Group</p>
              <p className="font-medium">{apiData?.DLBloodGroup}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Issue Date</p>
              <p className="font-medium">
                {new Date(apiData?.DLIssueDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valid Until</p>
              <p className="font-medium">{apiData?.DLValidUpto}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{apiData?.DLGender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Vehicle Description
              </p>
              <p className="font-medium">{apiData?.DLVehicleDescription}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vehicle Class</p>
              <p className="font-medium">{apiData?.DLVehicleClass}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">RTO Code</p>
              <p className="font-medium">{apiData?.DLRTOCode}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">RTO Name</p>
              <p className="font-medium">{apiData?.DLRTOName}</p>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Details Card */}
        {/* <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Make</p>
              <p className="font-medium">{apiData?.vehicle.make}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Model</p>
              <p className="font-medium">{apiData?.vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-medium">{apiData?.vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">License Plate</p>
              <p className="font-medium">{apiData?.vehicle.licensePlate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">VIN</p>
              <p className="font-medium">{apiData?.vehicle.vin}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Color</p>
              <p className="font-medium">
                {apiData?.vehicle.color}{" "}
                <span
                  className={`w-4 h-4 bg-${apiData?.vehicle?.color.toLowerCase()}-600 rounded-full bg-slate-300  inline-block`}
                ></span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Registration Expiry
              </p>
              <p className="font-medium">
                {apiData?.vehicle.registrationExpiry}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Insurance Provider
              </p>
              <p className="font-medium">
                {apiData?.vehicle.insuranceProvider}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Insurance Policy Number
              </p>
              <p className="font-medium">
                {apiData?.vehicle.insurancePolicyNumber}
              </p>
            </div>
          </CardContent>
        </Card> */}

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
              <div>
                <p className="text-sm text-muted-foreground">DL Number</p>
                <p className="font-medium">{apiData?.DLNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Challan Number</p>
                <p className="font-medium">{apiData?.ChallanNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Challan Date</p>
                <p className="font-medium">{apiData?.ChallanDate}</p>
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
                <p className="text-sm text-muted-foreground">Vehicle Number</p>
                <p className="font-medium">{apiData?.VehicleNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accused Name</p>
                <p className="font-medium">{apiData?.AccusedName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Number</p>
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
                <p className="text-sm text-muted-foreground">Challan Status</p>
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

        {/* Challan Impound Documents Card */}
        {/* <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5" />
              Challan Impound Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Impounded Documents
                </p>
                <p className="font-medium">
                  {apiData.challan.impounded_document &&
                  apiData.challan.impounded_document.length > 0
                    ? apiData.challan.impounded_document.join(", ")
                    : "None"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehicle Image</p>
                {apiData.challan.vehicleImg ? (
                  <Image
                    src={`data:image/jpeg;base64,${apiData.challan.vehicleImg}`}
                    alt="Vehicle"
                    width={200}
                    height={150}
                    className="mt-2 rounded-md"
                  />
                ) : (
                  <p className="font-medium">Not available</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Vehicle Impound Image
                </p>
                {apiData.challan.vehicleImpoundImg ? (
                  <Image
                    src={`data:image/jpeg;base64,${apiData.challan.vehicleImpoundImg}`}
                    alt="Vehicle Impound"
                    width={200}
                    height={150}
                    className="mt-2 rounded-md"
                  />
                ) : (
                  <p className="font-medium">Not available</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Document Impound Image
                </p>
                {apiData.challan.docImpoundImg ? (
                  <Image
                    src={`data:image/jpeg;base64,${apiData.challan.docImpoundImg}`}
                    alt="Document Impound"
                    width={200}
                    height={150}
                    className="mt-2 rounded-md"
                  />
                ) : (
                  <p className="font-medium">Not available</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card> */}

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
              <div>
                <label htmlFor="remarks" className="text-sm font-medium">
                  Remarks
                </label>
                <Textarea
                  id="remarks"
                  placeholder="Enter your remarks here"
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="hearing-type" className="text-sm font-medium">
                  Recommended Hearing Type
                </label>
                <Select>
                  <SelectTrigger id="hearing-type" className="mt-1">
                    <SelectValue placeholder="Select hearing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online Hearing</SelectItem>
                    <SelectItem value="offline">Offline Hearing</SelectItem>
                    <SelectItem value="without">
                      Process without Hearing
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-center">
                <Button size="sm">Submit Recommendation</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
