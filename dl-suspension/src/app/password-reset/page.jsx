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
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { decrypt } from "@/utils/crypto";
import { serviceUrl } from "@/app/constant";
import { CheckCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export default function CardWithInputs() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const userToken = useSelector((state) => state.auth.token);
  const userDetails = useSelector((state) => state.auth.user);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");

  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isReenterPasswordVisible, setIsReenterPasswordVisible] =
    useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const { toast } = useToast();

  const router = useRouter();

  useEffect(() => {
    const auth_data = (userToken);
    setToken(auth_data);

    const user_data = JSON.parse(decrypt(userDetails));
    setUser(user_data);
  }, [token]);

  const updateRtoUserPassword = async () => {
    setPasswordMismatch(false);
    if (newPassword !== reenterPassword) {
      setPasswordMismatch(true);
      return;
    }

    if (currentPassword == reenterPassword) {
      toast({
        variant: "destructive",
        title: "OPPS! ",
        description:
          "The new password cannot be the same as the current password. Please choose a different password.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    setIsLoading(true);

    if (currentPassword && reenterPassword && newPassword) {
      try {
        const response = await fetch(`${serviceUrl}update-user-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            UserID: user?.AuthorityUserID,
            OldPassword: currentPassword,
            NewPassword: reenterPassword,
          }),
        });
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
            router.push(`/logout`);
          } else if (decoded_data?.status == 1) {
            toast({
              variant: "destructive",
              title: "Failed! ",
              description: decoded_data.message,
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Failed! ",
              description: "Error occurred",
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
          }
        } else {
          const errorData = await response.json();
          toast({
            variant: "destructive",
            title: "Failed! ",
            description: errorData.message,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
          setError(`${errorData.message}`);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed! ",
          description: error.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-start mt-5 justify-center min-h-screen bg-background-">
      <Card className="w-[500px] border border-slate-400">
        <CardHeader className="flex items-center">
          <CardTitle>User Password Reset</CardTitle>
          <CardDescription>Please enter your details below.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            {/* Current Password Field */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="flex">
                <Input
                  id="currentPassword"
                  type={isCurrentPasswordVisible ? "text" : "password"}
                  placeholder="Enter current password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <div className="bg-slate-200 px-3 flex items-center">
                  {isCurrentPasswordVisible ? (
                    <FaRegEyeSlash
                      onClick={() =>
                        setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                      }
                    />
                  ) : (
                    <FaRegEye
                      onClick={() =>
                        setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* New Password Field */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="flex">
                <Input
                  id="newPassword"
                  type={isNewPasswordVisible ? "text" : "password"}
                  placeholder="Enter new password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="bg-slate-200 px-3 flex items-center">
                  {isNewPasswordVisible ? (
                    <FaRegEyeSlash
                      onClick={() =>
                        setIsNewPasswordVisible(!isNewPasswordVisible)
                      }
                    />
                  ) : (
                    <FaRegEye
                      onClick={() =>
                        setIsNewPasswordVisible(!isNewPasswordVisible)
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Re-enter Password Field */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="reenterPassword">Re-enter Password</Label>
              <div className="flex">
                <Input
                  id="reenterPassword"
                  type={isReenterPasswordVisible ? "text" : "password"}
                  placeholder="Re-enter new password"
                  required
                  value={reenterPassword}
                  onChange={(e) => setReenterPassword(e.target.value)}
                />
                <div className="bg-slate-200 px-3 flex items-center">
                  {isReenterPasswordVisible ? (
                    <FaRegEyeSlash
                      onClick={() =>
                        setIsReenterPasswordVisible(!isReenterPasswordVisible)
                      }
                    />
                  ) : (
                    <FaRegEye
                      onClick={() =>
                        setIsReenterPasswordVisible(!isReenterPasswordVisible)
                      }
                    />
                  )}
                </div>
              </div>
              {passwordMismatch && (
                <p className="text-red-500 text-sm">
                  New Password and Re-enter Password do not match!
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={updateRtoUserPassword} disabled={isLoading}>
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
    </div>
  );
}
