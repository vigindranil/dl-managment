"use client";
import React, { Suspense, useEffect, useState } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";
import AuthorizationWrapper from "@/components/AuthorizationWrapper";

const Layout = () => {
  useEffect(() => {}, []);

  const breadcrumb = [
    { href: "#", name: "RTO Authority" },
    { href: "/dashboard", name: "Dashboard" },
  ];

  return (
    <SidebarLayout breadcrumb={breadcrumb}>
      <AuthorizationWrapper
        authorizedUserTypes={[10]}
        redirectPath="/dashboard"
      ></AuthorizationWrapper>

      <Suspense fallback={<Loading />}>
        <Page />
      </Suspense>
    </SidebarLayout>
  );
};

export default Layout;
