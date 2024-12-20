import React, { Suspense }  from "react";
import Page from "./page";
import Loading from "./loading";
import SidebarLayout from "@/components/sidebar-layout";

const layout = () => {
  const breadcrumb = [
    { href: "#", name: "RTO Authority" },
    { href: "#", name: "DL Search" },
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
