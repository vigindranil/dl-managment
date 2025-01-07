import React, { Suspense } from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";
import AuthorizationWrapper from "@/components/AuthorizationWrapper";

const layout = async ({ params }) => {
  const { type, range } = await params;
  const breadcrumb = [
    { href: "#", name: "RTO Authority" },
    { href: "/dashboard", name: "Dashboard" },
    { href: "#", name: "DL Suspensions" },
  ];

  return (
    <SidebarLayout breadcrumb={breadcrumb}>
      <AuthorizationWrapper
        authorizedUserTypes={[10]}
        redirectPath="/dl-suspension"
      ></AuthorizationWrapper>
      <Suspense fallback={<Loading />}>
        <Page type={type} range={range} />
      </Suspense>
    </SidebarLayout>
  );
};

export default layout;
