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
  BadgeIcon as IdCard,
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
import { X } from "lucide-react";
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
import Loading from "./loading";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { DateTimePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";

const Page = ({ challanno, dlnumber }) => {
  const authToken = useSelector((state) => state.auth.token);
  const [token, setToken] = useState(null);
  const userDetails = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);

  const [apiData, setApiData] = useState("");
  const [base64ImageDoc, setBase64ImageDoc] = useState({});

  const [remarks, setRemarks] = useState("");
  const [pendingType, setPendingType] = useState("");
  const [onlineMeetingLink, setOnlineMeetingLink] = useState("");
  const [hearingDate, setHearingDate] = useState(null);
  const [isInvalidRemarks, setIsInvalidRemarks] = useState(false);
  const [isInvalidPendingType, setIsInvalidPendingType] = useState(false);
  const [isInvalidOnlineMeetingLink, setIsInvalidOnlineMeetingLink] =
    useState(false);
  const [isInvalidHearingDate, setIsInvalidHearingDate] = useState(false);

  const [error, setError] = useState("");
  const [dlOnwer, setDlOnwer] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    const parse_token = authToken;
    setToken(parse_token);

    const user_data = JSON.parse(decrypt(userDetails));
    setUser(user_data);
    token && dlSuspensionRecommendedViewUser();
  }, [token]);
  // console.log(hearingDate.toISOString());

  const handleHearingDateChange = (date) => {
    setHearingDate(date);
    setIsInvalidHearingDate(false);
  };

  async function dlSuspensionRecommendedViewUser() {
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
          dlSuspensionRecommendedUserDocument(result?.data[0]?.ChallanDate);
          dlOnwerDetails();
        })
        .catch((error) => setApiData(null));
    } catch (error) {
      setError(error.message);
    }
  }

  async function dlSuspensionRecommendedUserDocument(date) {
    const formatteddate = new Date(date).toLocaleDateString("en-CA");
    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      await fetch(
        `${serviceUrl}challan/get-imponded-docs?date=${formatteddate}&merchantid=WB116XHRUP13265&challan_no=${challanno}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setBase64ImageDoc(result.data);
        })
        .catch((error) => setBase64ImageDoc(null));
    } catch (error) {
      setError(error.message);
    }
  }

  const isValidMeetingLink = (link) => {
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(link);
  };

  const isValidHearingDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  };

  const dlSuspensionRecommendation = async () => {
    setIsInvalidRemarks(false);
    setIsInvalidPendingType(false);
    setIsInvalidOnlineMeetingLink(false);
    setIsInvalidHearingDate(false);

    remarks || setIsInvalidRemarks(true);
    pendingType || setIsInvalidPendingType(true);

    if (pendingType === "2" || pendingType === "3") {
      if (!hearingDate) {
        setIsInvalidHearingDate(true);
      } else if (!isValidHearingDate(hearingDate)) {
        setIsInvalidHearingDate(true);
        toast({
          variant: "destructive",
          title: "Invalid Date",
          description: "Please select a valid future date for the hearing.",
        });
        return;
      }
    }

    if (pendingType === "3") {
      if (!onlineMeetingLink) {
        setIsInvalidOnlineMeetingLink(true);
      } else if (!isValidMeetingLink(onlineMeetingLink)) {
        setIsInvalidOnlineMeetingLink(true);
      }
    }

    if (
      remarks &&
      pendingType &&
      ((pendingType !== "2" && pendingType !== "3") || hearingDate) &&
      (pendingType !== "3" ||
        (onlineMeetingLink && isValidMeetingLink(onlineMeetingLink)))
    ) {
      const padZero = (num) => (num < 10 ? `0${num}` : num);

      const formatDate = (date) => {
        if (!(date instanceof Date)) return null; // Ensure it's a valid Date object
        const year = date.getFullYear();
        const month = padZero(date.getMonth() + 1); // Months are zero-indexed
        const day = padZero(date.getDate());
        const hours = padZero(date.getHours());
        const minutes = padZero(date.getMinutes());
        const seconds = padZero(date.getSeconds());
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      try {
        const response = await fetch(
          `${serviceUrl}challan/update-dl-suspension-recommendation-details`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              DLSuspensionID: apiData?.DLSuspensionID,
              ChallanStatus: pendingType,
              OnlineMeetingLink: onlineMeetingLink,
              EntryUserID: user?.AuthorityUserID,
              Remarks: remarks,
              HearingDate: hearingDate ? formatDate(hearingDate) : null,
            }),
          }
        );
        if (response.ok) {
          const decoded_data = await response.json();

          if (decoded_data?.status == 0) {
            toast({
              title: (
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" />
                  <span>Success!</span>
                </div>
              ),
              description: decoded_data.message,
            });
            router.push(`/dl-suspensions/1/1`);
          } else {
            setError("User not created");
            toast({
              variant: "destructive",
              title: "Failed! ",
              description: error,
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
          }
        } else {
          const errorData = await response.json();
          setError(`${errorData.message}`);
          toast({
            variant: "destructive",
            title: "Failed! ",
            description: error,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } catch (error) {
        setError("Failed to create user, Internal server error");
        toast({
          variant: "destructive",
          title: "Failed! ",
          description: error,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "OPPS! ",
        description: "Please fill in all required fields correctly",
      });
    }
  };

  const dlOnwerDetails = async () => {
    try {
      const response = await fetch(
        `${serviceUrl}sarthi/get-dl-details?dl_number=${dlnumber}`,
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
          setDlOnwer(results);
        } else {
          setDlOnwer(null);
        }
      } else {
        const errorData = await response.json();
        setError(`${errorData.message}`);
      }
    } catch (error) {
      setError("Failed to create user, Internal server error");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Challan Details</h1>
      {apiData || dlOnwer || base64ImageDoc ? (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem
            value="dl-details"
            className="border-b border-gray-800 bg-slate-50"
          >
            <AccordionTrigger>
              <span className="font-bold">DL Details</span>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    DL Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-8">
                  {/* Left Section: DL Details */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">
                        {dlOnwer?.data?.name ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Son/Wife/Daughter of
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.fatherName ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">DL Number</p>
                      <p className="font-medium">
                        {dlOnwer?.data?.dlno ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Date of Birth
                      </p>
                      <p className="font-medium">
                        {new Date(
                          dlOnwer?.data?.dob ?? "N/A"
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Phone Number
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.mobileNo ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Blood Group
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.bloodGroup ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Issue Date
                      </p>
                      <p className="font-medium">
                        {new Date(
                          dlOnwer?.data?.issuedt ?? "N/A"
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
                        {dlOnwer?.data?.dlNonTransValdTill ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Transport Valid Until
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.dlTransValdTill?.trim()
                          ? dlOnwer.data.dlTransValdTill
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium">
                        {dlOnwer?.data?.gender ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Vehicle Class
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.vehicleClass.join(", ") ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">RTO Code</p>
                      <p className="font-medium">
                        {dlOnwer?.data?.authorityCode ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">RTO Name</p>
                      <p className="font-medium">
                        {dlOnwer?.data?.authorityName ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Permanent Address
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.permAdd1 ?? "N/A"},
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.permAdd2 ?? "N/A"},
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.permAdd3 ?? "N/A"},
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.permPin ?? "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Present Address
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.tempAdd1 ?? "N/A"},
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.tempAdd2 ?? "N/A"},
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.tempAdd3 ?? "N/A"},
                      </p>
                      <p className="font-medium">
                        {dlOnwer?.data?.tempPin ?? "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Right Section: Photo and Signature */}
                  <div className="flex flex-col items-center gap-10">
                    <p className="text-sm text-muted-foreground">
                      DL Owner Photo
                    </p>
                    {/* DL Owner Photo */}
                    <div className="w-[200px] h-[200px] flex items-center justify-center rounded-lg">
                      {dlOnwer?.data?.photo ? (
                        <Image
                          src={`data:image/png;base64,${dlOnwer?.data?.photo}`}
                          alt="Vehicle Image"
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

                    {/* Signature */}
                    <p className="text-sm text-muted-foreground">
                      DL Owner Signature
                    </p>
                    <div className="w-[200px] h-[100px] flex items-center justify-center rounded-lg">
                      {dlOnwer?.data?.signature ? (
                        <Image
                          src={`data:image/png;base64,${dlOnwer?.data?.signature}`}
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
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="challan-details"
            className="border-b border-gray-800 bg-slate-50"
          >
            <AccordionTrigger>
              <span className="font-bold">Challan Details</span>
            </AccordionTrigger>
            <AccordionContent>
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
                      <p className="text-sm text-muted-foreground">
                        Challan Place
                      </p>
                      <p className="font-medium">{apiData?.ChallanPlace}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        State Code
                      </p>
                      <p className="font-medium">{apiData?.StateCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Accused Type
                      </p>
                      <p className="font-medium">{apiData?.AccusedType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Officer Name
                      </p>
                      <p className="font-medium">{apiData?.OfficerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Officer Designation
                      </p>
                      <p className="font-medium">
                        {apiData?.OfficerDesignation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Vehicle Number
                      </p>
                      <p className="font-medium">{apiData?.VehicleNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Accused Name
                      </p>
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
                      <p className="text-sm text-muted-foreground">
                        Department
                      </p>
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
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="challan-impound-documents"
            className="border-b border-gray-800 bg-slate-50"
          >
            <AccordionTrigger>
              <span className="font-bold">Challan Impound Documents</span>
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileImage className="h-5 w-5" />
                    Challan Impound Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Impounded Documents */}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Impounded Documents
                      </p>
                      <div className="w-[250px] h-[250px] flex items-center justify-center rounded-lg cursor-pointer">
                        {base64ImageDoc && base64ImageDoc?.docImpoundImg ? (
                          <Image
                            src={`data:image/png;base64,${base64ImageDoc?.docImpoundImg}`}
                            alt="Document Image"
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                            onClick={() =>
                              setSelectedImage(base64ImageDoc?.docImpoundImg)
                            }
                          />
                        ) : (
                          <div className="text-md text-black-500">
                            No document available
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Image */}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Vehicle Image
                      </p>
                      <div className="w-[250px] h-[250px] flex items-center justify-center rounded-lg cursor-pointer">
                        {base64ImageDoc && base64ImageDoc?.vehicleImpoundImg ? (
                          <Image
                            src={`data:image/png;base64,${base64ImageDoc?.vehicleImpoundImg}`}
                            alt="Vehicle Image"
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                            onClick={() =>
                              setSelectedImage(
                                base64ImageDoc?.vehicleImpoundImg
                              )
                            }
                          />
                        ) : (
                          <div className="text-md text-black-500">
                            No vehicle image available
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Impound Image */}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Vehicle Impound Image
                      </p>
                      <div className="w-[250px] h-[250px] flex items-center justify-center rounded-lg cursor-pointer">
                        {base64ImageDoc && base64ImageDoc?.vehicleImg ? (
                          <Image
                            src={`data:image/png;base64,${base64ImageDoc?.vehicleImg}`}
                            alt="Vehicle Impound Image"
                            width={200}
                            height={200}
                            className="rounded-lg object-cover"
                            onClick={() =>
                              setSelectedImage(base64ImageDoc?.vehicleImg)
                            }
                          />
                        ) : (
                          <div className="text-md text-black-500">
                            No vehicle image available
                          </div>
                        )}
                      </div>

                      {/* Modal for Displaying Selected Image */}
                      {selectedImage && (
                        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                          <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-[90%] max-h-[90%]">
                            <button
                              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                              onClick={() => setSelectedImage(null)}
                            >
                              <X className="w-6 h-6" />
                            </button>
                            <Image
                              src={`data:image/png;base64,${selectedImage}`}
                              alt="Selected Image"
                              width={800}
                              height={1000}
                              className="rounded-lg max-w-full max-h-[80vh] object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <Loading />
      )}

      {/* Recommendation Card */}
      {apiData?.ChallanStatusID === 1 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IterationCcw className="h-5 w-5" />
              Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <label htmlFor="remarks" className="text-sm font-medium">
                  Remarks
                </label>
                <Textarea
                  id="remarks"
                  placeholder="Enter your remarks here"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className={`rounded-e-none rounded-s-md ring-inset ${
                    isInvalidRemarks &&
                    !remarks &&
                    "ring-1 ring-red-500 focus-visible:ring-red-500"
                  }`}
                />
              </div>
              {isInvalidRemarks && !remarks && (
                <p className="text-red-500 text-sm">Remarks is required!</p>
              )}
              <div>
                <label htmlFor="hearing-type" className="text-sm font-medium">
                  Recommended Hearing Type
                </label>
                <Select
                  id="hearing-type"
                  className="mt-1"
                  value={pendingType}
                  onValueChange={(value) => setPendingType(value)}
                >
                  <SelectTrigger
                    className={`rounded-e-none rounded-s-md ring-inset ${
                      isInvalidPendingType &&
                      !pendingType &&
                      "ring-1 ring-red-500 focus-visible:ring-red-500"
                    }`}
                  >
                    <SelectValue placeholder="Select hearing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">Online Hearing</SelectItem>
                    <SelectItem value="2">Offline Hearing</SelectItem>
                    <SelectItem value="4">Disposed hearing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isInvalidPendingType && !pendingType && (
                <p className="text-red-500 text-sm">
                  Recommendation is required!
                </p>
              )}
              {(pendingType === "2" || pendingType === "3") && (
                <div className="mb-4">
                  <label
                    htmlFor="hearing-date"
                    className="text-sm font-medium block mb-1"
                  >
                    Hearing Date
                  </label>
                  <DateTimePicker
                    id="hearing-date"
                    selected={hearingDate}
                    onChange={handleHearingDateChange}
                    className={`rounded-e-none rounded-s-md ring-inset ${
                      isInvalidHearingDate &&
                      !hearingDate &&
                      "ring-1 ring-red-500 focus-visible:ring-red-500"
                    }`}
                  />
                  {isInvalidHearingDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {!hearingDate
                        ? "Hearing date is required!"
                        : "Please select a valid future date for the hearing."}
                    </p>
                  )}
                </div>
              )}
              {pendingType === "3" && (
                <div>
                  <label
                    htmlFor="online-meeting-link"
                    className="text-sm font-medium"
                  >
                    Online Meeting Link
                  </label>
                  <Textarea
                    id="online-meeting-link"
                    placeholder="Enter the online meeting link"
                    value={onlineMeetingLink}
                    onChange={(e) => setOnlineMeetingLink(e.target.value)}
                    className={`rounded-e-none rounded-s-md ring-inset ${
                      isInvalidOnlineMeetingLink &&
                      "ring-1 ring-red-500 focus-visible:ring-red-500"
                    }`}
                  />
                </div>
              )}
              {pendingType === "3" && isInvalidOnlineMeetingLink && (
                <p className="text-red-500 text-sm">
                  {!onlineMeetingLink
                    ? "Meeting Link is required!"
                    : "Please enter a valid meeting link (e.g., https://meet.google.com/abc-abc-abc)"}
                </p>
              )}
              <div className="flex justify-center">
                <Button onClick={dlSuspensionRecommendation} size="sm">
                  Submit Recommendation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IterationCcw className="h-5 w-5" />
              Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <label htmlFor="remarks" className="text-sm font-medium">
                  Remarks
                </label>
                <Textarea
                  id="remarks"
                  placeholder="Enter your remarks here"
                  value={apiData?.Remarks}
                  readOnly
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="hearing-date"
                  className="text-sm font-medium block mb-1"
                >
                  Hearing Date
                </label>
                <Textarea
                  id="hearing-date"
                  value={
                    apiData?.HearingDate
                      ? format(
                          new Date(apiData.HearingDate),
                          "dd MMM yyyy, hh:mm a"
                        )
                      : "" // Fallback in case HearingDate is null or invalid
                  }
                  readOnly
                />
              </div>

              {apiData?.ChallanStatusID === 3 && (
                <div>
                  <label
                    htmlFor="online-meeting-link"
                    className="text-sm font-medium"
                  >
                    Online Meeting Link
                  </label>
                  <Textarea
                    id="online-meeting-link"
                    placeholder="Enter the online meeting link"
                    value={apiData?.OnlineMeetingLink}
                    readOnly // Ensures the user can't edit if it's just for viewing
                    className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Page;
