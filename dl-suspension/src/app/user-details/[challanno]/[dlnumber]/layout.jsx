import React, { Suspense } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";
import { Toaster } from "@/components/ui/toaster";
import AuthorizationWrapper from "@/components/AuthorizationWrapper";

const layout = async ({ params }) => {
  const { challanno, dlnumber } = await params;
  const breadcrumb = [
    { href: "#", name: "RTO Authority" },
    { href: "/dashboard", name: "Dashboard" },
    { href: "/dl-suspensions/1/1", name: "DL Suspensions" },
    { href: "#", name: "Challan Details" },
  ];

  return (
    <SidebarLayout breadcrumb={breadcrumb}>
      <AuthorizationWrapper
        authorizedUserTypes={[10]}
        redirectPath="/user-details"
      ></AuthorizationWrapper>

      <Suspense fallback={<Loading />}>
        <Page challanno={challanno} dlnumber={dlnumber} />
      </Suspense>
      <Toaster />
    </SidebarLayout>
  );
};

export default layout;
