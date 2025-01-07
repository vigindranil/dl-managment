import React, { Suspense } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";
import AuthorizationWrapper from "@/components/AuthorizationWrapper";

const layout = () => {
  const breadcrumb = [
    { href: "#", name: "RTO Authority" },
    { href: "#", name: "challan Search" },
  ];
  return (
    <SidebarLayout breadcrumb={breadcrumb}>
      <AuthorizationWrapper
        authorizedUserTypes={[10]}
        redirectPath="/challan-search"
      ></AuthorizationWrapper>

      <Suspense fallback={<Loading />}>
        <Page />
      </Suspense>
    </SidebarLayout>
  );
};

export default layout;
