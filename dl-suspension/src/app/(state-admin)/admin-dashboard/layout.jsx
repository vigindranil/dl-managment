"use client";
import React, { Suspense, useEffect, useState } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";
import { useAuthorizationCheck } from "@/hooks/use-userAuthorization";
import AuthorizationWrapper from "@/components/AuthorizationWrapper";

const layout = () => {
  useEffect(() => {}, []);

  const breadcrumb = [
    { href: "#", name: "State Authority" },
    { href: "/admin-dashboard", name: "Dashboard" },
  ];

  return (
    <SidebarLayout breadcrumb={breadcrumb}>
      <AuthorizationWrapper
        authorizedUserTypes={[1]}
        redirectPath="/admin-dashboard"
      ></AuthorizationWrapper>
      <Suspense fallback={<Loading />}>
        <Page />
      </Suspense>
    </SidebarLayout>
  );
};

export default layout;
