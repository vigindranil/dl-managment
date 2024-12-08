"use client"
import React, { Suspense, useEffect, useState } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";
import { useSelector } from "react-redux";

const layout = () => {
  const [ authToken, setAuthToken ] = useState("");
  const [ user, setUser ] = useState("");
  const token = useSelector((state) => state.auth.token);
  const userDetails = useSelector((state) => state.auth.user);

  useEffect(() => {
    setAuthToken(token);
    setUser(userDetails);
  }, []);
  const breadcrumb = [
    { href: "#", name: "RTO Authority" },
    { href: "/dashboard", name: "Dashboard" }
  ];

  return (
    <SidebarLayout breadcrumb={breadcrumb}>
      <Suspense fallback={<Loading />}>
        <Page />
      </Suspense>
    </SidebarLayout>
  );
};

export default layout;
