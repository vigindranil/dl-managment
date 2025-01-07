"use client";
import React, { Suspense, useEffect, useState } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";
import AuthorizationWrapper from "@/components/AuthorizationWrapper";

const layout = () => {
  const breadcrumb = [
    { href: "#", name: "State Authority" },
    { href: "/dashboard", name: "Dashboard" },
    { href: "#", name: "Password reset" },
  ];

  return (
    <SidebarLayout breadcrumb={breadcrumb}>
      <AuthorizationWrapper
        authorizedUserTypes={[10]}
        redirectPath="/password-reset"
      ></AuthorizationWrapper>

      <Suspense fallback={<Loading />}>
        <Page />
      </Suspense>
    </SidebarLayout>
  );
};

export default layout;
