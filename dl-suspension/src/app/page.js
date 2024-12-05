"use client";
import "./globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaAt } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaCircleExclamation } from "react-icons/fa6";
import { FaCircleCheck } from "react-icons/fa6";
import { ClipLoader } from "react-spinners";
// import { useRouter } from 'next/router';

export default function Home() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidUsername, setIsInvalidUsername] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const router = useRouter();

  const handleLogin = async () => {
    setIsLoading(true);


    
    setIsInvalidUsername(false);
    setIsInvalidPassword(false);
    username || setIsInvalidUsername(true);
    password || setIsInvalidPassword(true);

    if (username && password) {
      try {
        const response = await fetch("https://www.cloud2-api.site/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });

        if (response.ok) {
          const decoded_data = await response.json();
          decoded_data.data.user_id &&
            sessionStorage.setItem("userId", decoded_data.data.user_id);
          decoded_data.data.role &&
            sessionStorage.setItem("userRole", decoded_data.data.role);
          decoded_data.data.username &&
            sessionStorage.setItem("username", decoded_data.data.username);
          decoded_data.data.name &&
            sessionStorage.setItem("name", decoded_data.data.name);

          // const router = useRouter();
          router.push('/dashboard');
          // setLoggedIn("Logged In Successfull");
          setError("");
        } else {
          const errorData = await response.json();
          setError(`${errorData.message}`);
          setLoggedIn("");
        }
      } catch (error) {
        console.log(error.message);
        setError("Failed to login, Internal server error");
        setLoggedIn("");
      }
    }
    setIsLoading(false);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between login-bg-img">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex py-12 px-10">
        <Card className="mx-auto my-auto pt-2 max-w-sm">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-xl py-3 font-extrabold font-mono bg-gradient-to-r from-teal-200 via-orange-200  to-orange-400 text-transparent bg-clip-text tracking-[0.1em]">
              RTO Login
            </h1>
          </div>
          <div className="h-[1px] w-[79%] mx-auto bg-gradient-to-r from-transparent via-slate-400 to-transparent"></div>
          <CardHeader className="mt-0 pt-0">
            <CardDescription className="text-center">
              Enter your credentials below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <p className="text-red-500 text-sm mt-1">
                <FaCircleExclamation className="inline" /> <b>Login Failed:</b>{" "}
                {error}
              </p>
            )}

            {loggedIn && (
              <p className="text-green-500 text-sm mt-1">
                <FaCircleCheck className="inline animate-pulse" />{" "}
                <b>Success:</b> {loggedIn}
              </p>
            )}
            <div className="grid gap-4 mt-3">
              <div className="grid gap-1">
                <Label htmlFor="email" className="my-1">
                  Email
                </Label>
                <div className="flex">
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
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
              <div className="grid gap-1">
                <div className="flex items-center">
                  <Label htmlFor="password" className="my-1">
                    Password
                  </Label>
                </div>
                <div className="flex">
                  <Input
                    id="password"
                    type={`${isPasswordVisible ? "text" : "password"}`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`rounded-e-none rounded-s-md ring-inset ${
                      isInvalidPassword &&
                      !password &&
                      "ring-1 ring-red-500 focus-visible:ring-red-500"
                    }`}
                  />
                  <div className="bg-slate-200 px-3 ring-ring rounded-s-none rounded-e-md border-input flex items-center">
                    {isPasswordVisible ? (
                      <FaRegEyeSlash
                        className="text-slate-500 cursor-pointer"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      />
                    ) : (
                      <FaRegEye
                        className="text-slate-500 cursor-pointer"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      />
                    )}
                  </div>
                </div>
                {isInvalidPassword && !password && (
                  <p className="text-red-500 text-sm">Password is required!</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full my-2 mb-4"
                onClick={handleLogin}
                disabled={isLoading}
              >
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
                  "Login"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
