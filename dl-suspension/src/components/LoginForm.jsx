"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaAt, FaLock } from "react-icons/fa6";
import { serviceUrl } from "@/app/constant";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "@/redux/slices/authSlice";

export function LoginForm({ onLoginSuccess }) {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [authorityTypeID, setAuthorityTypeID] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!username || !password || !authorityTypeID) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${serviceUrl}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          AuthorityUserName: username,
          AuthorityPassword: password,
          UserTypeID: authorityTypeID,
        }),
      });

      const decodedData = await response.json();

      if (response.ok && decodedData?.status === 0) {
        onLoginSuccess(decodedData, authorityTypeID);
        dispatch(setToken(decodedData?.token));
        dispatch(setUser(JSON.stringify(decodedData?.data[0])));
      } else {
        setError(decodedData.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Failed to login. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="usertype">User Role</Label>
        <Select value={authorityTypeID} onValueChange={setAuthorityTypeID}>
          <SelectTrigger id="usertype">
            <SelectValue placeholder="Select User Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">State Authority</SelectItem>
            <SelectItem value="10">RTO Authority</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="text">Email</Label>
        <div className="relative">
          <FaAt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="email"
            type="text"
            placeholder="User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            id="password"
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
          />
          <button
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          >
            {isPasswordVisible ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-2 animate-fade-in">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            Logging in <ClipLoader color="#ffffff" size={20} className="ml-2" />
          </>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  );
}
