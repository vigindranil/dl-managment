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
  IdCard,
  Car,
  FileText,
  Clock,
  CircleCheck,
  Camera,
  CircleUserRound,
  IterationCcw
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

const Page = ({ challanno }) => {

  const [token, setToken] = useState("");
  const [userData, setUserData] = useState({
    accused_name: "Test Accused",
    dl_number: "WB2320140xxxxx",
    present_addr: "A K MUKHERJEE ROAD,KOLKATA",
    permanent_addr: "A K MUKHERJEE ROAD, KOLKATA",
    dob: "1985-08-08T00:00:00+05:30",
    contact_no: "983612xxxx",
    dlStatus: "Active",
    expiryDate: "12/31/2025",
    dlClass: "Class B",
    restrictions: "None",
    photoUrl:
      "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: "2022",
      licensePlate: "ABC 123",
      vin: "1HGBH41JXMN109186",
      color: "Silver",
      registrationExpiry: "12/31/2023",
      insuranceProvider: "SafeDrive Insurance",
      insurancePolicyNumber: "SD123456789",
    },
    dl_details: {
      dl_no: "WB2320140xxxxx",
      driver_name: "Test User",
      relation_name: "Test Relation Name",
      present_addr: "A K MUKHERJEE ROAD,KOLKATA",
      permanent_addr: "A K MUKHERJEE ROAD, KOLKATA",
      dob: "1985-08-08T00:00:00+05:30",
      blood_group: "Unknown",
      issue_date: "2014-04-24T00:00:00+05:30",
      issue_date_tr: null,
      valid_upto: "23-04-2034",
      valid_upto_tr: null,
      gender: "Male",
      vehicle_desc: "LIGHT MOTOR VEHICLE",
      vehicle_class: "LMV",
      rto_code: "WB23",
      rto_name: "L.A. BARRACKPORE",
    },
    challan: {
      dl_number: "WB2320140xxxxx",
      challan_no: "WB21001024100xxxxxxx",
      challan_date: "2024-10-04 19:15:44",
      challan_place: "West Bengal 700048, India",
      state_code: "WB",
      accused_type: "owner",
      officer_name: "Test Officer",
      officer_designation: "Inspector",
      vehicle_no: "WB23FXXXX",
      accused_name: "Test Accused",
      contact_no: "983612xxxx",
      rto_name: "Bidhannagar Police Commi.",
      rto_code: "07",
      challan_status: "Pending",
      department: "Traffic",
      offence_details: [
        {
          name: "184 MVA Driving Vehicle Dangerously #",
          act: "184"
        }
      ]
    },
  });

  return (
    <div className="p-6">
      {/* <h2 className="text-lg font-bold mb-4">Params:{challanno}</h2> */}
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
              <p className="font-medium">{userData?.accused_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">DL Number</p>
              <p className="font-medium">{userData?.dl_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">
                {new Date(userData?.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{userData?.contact_no}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{userData?.present_addr}</p>
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
              src={userData?.photoUrl}
              alt="DL Owner"
              width={200}
              height={200}
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
              <p className="font-medium">{userData?.dl_details.dl_no}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Driver Name</p>
              <p className="font-medium">
                {userData?.dl_details.driver_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Relation Name</p>
              <p className="font-medium">
                {userData?.dl_details.relation_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Present Address
              </p>
              <p className="font-medium">
                {userData?.dl_details.present_addr}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Permanent Address
              </p>
              <p className="font-medium">
                {userData?.dl_details.permanent_addr}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-medium">
                {new Date(userData?.dl_details?.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blood Group</p>
              <p className="font-medium">
                {userData?.dl_details.blood_group}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Issue Date</p>
              <p className="font-medium">
                {new Date(userData?.dl_details?.issue_date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valid Until</p>
              <p className="font-medium">
                {userData?.dl_details.valid_upto}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium">{userData?.dl_details.gender}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Vehicle Description
              </p>
              <p className="font-medium">
                {userData?.dl_details.vehicle_desc}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vehicle Class</p>
              <p className="font-medium">
                {userData?.dl_details.vehicle_class}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">RTO Code</p>
              <p className="font-medium">{userData?.dl_details.rto_code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">RTO Name</p>
              <p className="font-medium">{userData?.dl_details.rto_name}</p>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Make</p>
              <p className="font-medium">{userData?.vehicle.make}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Model</p>
              <p className="font-medium">{userData?.vehicle.model}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year</p>
              <p className="font-medium">{userData?.vehicle.year}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">License Plate</p>
              <p className="font-medium">{userData?.vehicle.licensePlate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">VIN</p>
              <p className="font-medium">{userData?.vehicle.vin}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Color</p>
              <p className="font-medium">{userData?.vehicle.color} <span className={`w-4 h-4 bg-${userData?.vehicle?.color.toLowerCase()}-600 rounded-full bg-slate-300  inline-block`}></span></p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Registration Expiry
              </p>
              <p className="font-medium">
                {userData?.vehicle.registrationExpiry}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Insurance Provider
              </p>
              <p className="font-medium">
                {userData?.vehicle.insuranceProvider}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Insurance Policy Number
              </p>
              <p className="font-medium">
                {userData?.vehicle.insurancePolicyNumber}
              </p>
            </div>
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
              <div>
                <p className="text-sm text-muted-foreground">DL Number</p>
                <p className="font-medium">{userData?.challan?.dl_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Challan Number</p>
                <p className="font-medium">{userData?.challan?.challan_no}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Challan Date</p>
                <p className="font-medium">{userData?.challan?.challan_date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Challan Place</p>
                <p className="font-medium">{userData?.challan?.challan_place}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">State Code</p>
                <p className="font-medium">{userData?.challan?.state_code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accused Type</p>
                <p className="font-medium">{userData?.challan?.accused_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Officer Name</p>
                <p className="font-medium">{userData?.challan?.officer_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Officer Designation</p>
                <p className="font-medium">{userData?.challan?.officer_designation}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehicle Number</p>
                <p className="font-medium">{userData?.challan?.vehicle_no}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accused Name</p>
                <p className="font-medium">{userData?.challan?.accused_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact Number</p>
                <p className="font-medium">{userData?.challan?.contact_no}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RTO Name</p>
                <p className="font-medium">{userData?.challan?.rto_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">RTO Code</p>
                <p className="font-medium">{userData?.challan?.rto_code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Challan Status</p>
                <p className="font-medium">{(userData?.challan?.challan_status).toUpperCase() == "PENDING" ? (<Clock className="w-4 h-4 text-yellow-500 inline" />) : (<CircleCheck className="w-4 h-4 text-emerald-500 inline" />)} {userData?.challan?.challan_status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{userData?.challan?.department}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Offence Details</p>
              {userData?.challan?.offence_details.map((offence, index) => (
                <div key={index} className="mb-2">
                  <p className="font-medium">{offence.name}</p>
                  <p className="text-sm text-muted-foreground">Act: {offence.act}</p>
                </div>
              ))}
            </div>
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
                <label
                  htmlFor="hearing-type"
                  className="text-sm font-medium"
                >
                  Recommended Hearing Type
                </label>
                <Select>
                  <SelectTrigger id="hearing-type" className="mt-1">
                    <SelectValue placeholder="Select hearing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online Hearing</SelectItem>
                    <SelectItem value="offline">Offline Hearing</SelectItem>
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
