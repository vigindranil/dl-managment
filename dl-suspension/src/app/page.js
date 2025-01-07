"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaAt, FaLock, FaUserShield } from "react-icons/fa6";
import { serviceUrl } from "@/app/constant";
import { LoginForm } from "@/components/LoginForm.jsx";
import { BackgroundAnimation } from "@/components/BackgroundAnimation.jsx";


export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLoginSuccess = (decodedData, authorityTypeID) => {
    dispatch(setToken(decodedData?.token));
    dispatch(setUser(JSON.stringify(decodedData?.data[0])));
    if (authorityTypeID === "1") {
      router.push("/admin-dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main 
    className="flex min-h-screen flex-col items-center justify-center p-4 bg-cover bg-center"
    style={{ backgroundImage: "url('/assets/img/login_img.jpg')" }}
  >
      <BackgroundAnimation />
      <div className="animate-fade-in-down">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Authority Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

