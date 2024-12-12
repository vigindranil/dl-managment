"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { decrypt } from "@/utils/crypto";
import { serviceUrl } from "@/app/constant";
import { FaAt } from "react-icons/fa6";
import { FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle } from "lucide-react"; // Importing a green checkmark icon from Lucide

export default function CardWithInputs() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const userToken = useSelector((state) => state.auth.token);
  const userDetails = useSelector((state) => state.auth.user);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [rtoPreference, setRtoPreference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rtoOptions, setRtoOptions] = useState([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const [error, setError] = useState("");

  const [isInvalidUsername, setIsInvalidUsername] = useState(false);
  const [isInvalidFullName, setIsInvalidFullName] = useState(false);
  const [isInvalidContactNo, setIsInvalidContactNo] = useState(false);
  const [isInvalidRtoPreference, setIsInvalidRtoPreference] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const auth_data = decrypt(userToken);
    setToken(auth_data);

    const user_data = JSON.parse(decrypt(userDetails));
    setUser(user_data);

    token && rtoDropDown();
  }, [token]);
  console.log("id", token);

  const rtoDropDown = async () => {
    try {
      console.log("token", token);
      if (!token) {
        console.error("Token is not available");
        return;
      }

      const response = await fetch(`${serviceUrl}get-all-rto-list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const result = await response.json();

        setRtoOptions(result.data);
      } else {
        console.error("Failed to fetch RTO options");
      }
    } catch (error) {
      console.error("Error fetching RTO options:", error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    setIsInvalidUsername(false);
    setIsInvalidFullName(false);
    setIsInvalidContactNo(false);
    setIsInvalidRtoPreference(false);

    username || setIsInvalidUsername(true);
    fullName || setIsInvalidFullName(true);
    contactNo || setIsInvalidContactNo(true);
    rtoPreference || setIsInvalidRtoPreference(true);

    if (username && fullName && contactNo && rtoPreference) {
      try {
        const response = await fetch(`${serviceUrl}create-rto-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Username: username,
            UserPassword: "admin@123",
            FullName: fullName,
            ContactNo: contactNo,
            RtoID: rtoPreference,
            EntryUserID: user?.AuthorityUserID,
            OperationStatus: "0",
            UserID: "0",
          }),
        });
        if (response.ok) {
          const decoded_data = await response.json();

          if (decoded_data?.status == 0) {
            console.log("user created");
            setShowSuccessDialog(true);
          } else {
            console.log("User not created");

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
    }
    setIsLoading(false);
  };

  const handleSuccessDialogAction = () => {
    setShowSuccessDialog(false);
    router.push("/admin-dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Please provide your details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form method="post" action="#">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <div className="flex">
                  <Input
                    id="username"
                    placeholder="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`rounded-e-none rounded-s-md ring-inset ${
                      isInvalidUsername &&
                      !username &&
                      "ring-1 ring-red-500 focus-visible:ring-red-500"
                    }`}
                  />
                  <div className="bg-slate-200 px-3 ring-ring rounded-s-none rounded-e-md border-input flex items-center">
                    <FaAt className="text-slate-500" />
                  </div>
                </div>
                {isInvalidUsername && !username && (
                  <p className="text-red-500 text-sm">Username is required!</p>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="flex">
                  <Input
                    id="fullName"
                    placeholder="Full Name"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`rounded-e-none rounded-s-md ring-inset ${
                      isInvalidFullName &&
                      !fullName &&
                      "ring-1 ring-red-500 focus-visible:ring-red-500"
                    }`}
                  />
                  <div className="bg-slate-200 px-3 ring-ring rounded-s-none rounded-e-md border-input flex items-center">
                    <FaUser className="text-slate-500" />
                  </div>
                </div>
                {isInvalidFullName && !fullName && (
                  <p className="text-red-500 text-sm">Full Name is required!</p>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="contactNo">Contact No</Label>
                <div className="flex">
                  <Input
                    id="contactNo"
                    placeholder="Contact No"
                    type="tel"
                    maxLength="10"
                    required
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    className={`rounded-e-none rounded-s-md ring-inset ${
                      isInvalidContactNo &&
                      !contactNo &&
                      "ring-1 ring-red-500 focus-visible:ring-red-500"
                    }`}
                  />
                  <div className="bg-slate-200 px-3 ring-ring rounded-s-none rounded-e-md border-input flex items-center">
                    <FaPhone className="text-slate-500" />
                  </div>
                </div>
                {isInvalidContactNo && !contactNo && (
                  <p className="text-red-500 text-sm">
                    Contact Number is required!
                  </p>
                )}
              </div>

              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="rto">RTO Preference</Label>
                <div className="flex">
                  <Select
                    required
                    value={rtoPreference}
                    onValueChange={(value) => setRtoPreference(value)}
                  >
                    <SelectTrigger
                      id="rto"
                      className={`rounded-e-none rounded-s-md ring-inset ${
                        isInvalidRtoPreference &&
                        !rtoPreference &&
                        "ring-1 ring-red-500 focus-visible:ring-red-500"
                      }`}
                    >
                      <SelectValue placeholder="Select RTO preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {rtoOptions.map((option, index) => (
                        <SelectItem key={index} value={option?.RTOCode}>
                          {option?.RTOName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="bg-slate-200 px-3 ring-ring rounded-s-none rounded-e-md border-input flex items-center">
                    <FaMapMarkerAlt className="text-slate-500" />
                  </div>
                </div>
                {isInvalidRtoPreference && !rtoPreference && (
                  <p className="text-red-500 text-sm">
                    RTO Preference is required!
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleSave} disabled={isLoading}>
            {" "}
            {isLoading ? (
              <div>
                Loading{" "}
                <ClipLoader
                  color="#fff"
                  loading={true}
                  size={15}
                  className="mx-1"
                />
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </CardFooter>
      </Card>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center justify-center">
            <CheckCircle size={48} color="green" className="mb-2" />
            <AlertDialogTitle className="text-center">
              User created successfully
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              The new user account has been created.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center mt-4">
            <AlertDialogAction
              onClick={handleSuccessDialogAction}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 mx-auto"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center justify-center">
            <CheckCircle size={48} color="green" className="mb-2" />
            <AlertDialogTitle className="text-center">
              User deleted successfully
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              The new user account has been created.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center mt-4">
            <AlertDialogAction
              onClick={handleSuccessDialogAction}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 mx-auto"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
