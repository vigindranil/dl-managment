"use client";

import * as React from "react";
import { Car, Search, BadgeCheck } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  teams: [
    {
      name: "RTO Suspensions",
      logo: Car,
      plan: "Recommendation Portal",
    },
  ],
  navMain: [
    {
      title: "DL Recommendation",
      url: "/dl-suspensions",
      icon: BadgeCheck,
      isActive: true,
      type: 10,
      items: [
        {
          title: "Recommended Suspensions",
          url: "/dl-suspensions/1",
        },
        {
          title: "Processed Suspensions",
          url: "/dl-suspensions/4",
        },
        {
          title: "Online Hearings",
          url: "/dl-suspensions/3",
        },
        {
          title: "Offline Hearings",
          url: "/dl-suspensions/2",
        },
      ],
    },
    {
      title: "DL Search",
      url: "#",
      icon: Search,
      isActive: true,
      type: 10,
      items: [
        {
          title: "By DL Number",
          url: "/dl-search",
        },
        {
          title: "By Challan Number",
          url: "#",
        },
      ],
    },
    {
      title: "Admin Operations",
      url: "#",
      icon: Search,
      isActive: true,
      type: 1,
      items: [
        {
          title: "Create RTO User",
          url: "/create-rto-user",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
