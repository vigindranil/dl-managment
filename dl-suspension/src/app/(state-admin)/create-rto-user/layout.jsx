<<<<<<< HEAD
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
    { href: "#", name: "State Authority" },
    { href: "/admin-dashboard", name: "Dashboard" },
    { href: "#", name: "Create RTO User" }
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
=======
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
    { href: "#", name: "State Authority" },
    { href: "/admin-dashboard", name: "Dashboard" },
    { href: "#", name: "Create RTO User" }
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
>>>>>>> 332037f05723294c26a90c560dbe147e0c2b8b4c
