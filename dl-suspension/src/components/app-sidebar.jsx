"use client";

import * as React from "react";
import {
  AudioWaveform,
  Car,
  Search,
  Command,
  Frame,
  UserRound,
  Map,
  PieChart,
  SquareTerminal,
} from "lucide-react";

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
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      type: 10,
      items: [
        {
          title: "Recommended Suspensions",
          url: "#",
        },
        {
          title: "Processed Suspensions",
          url: "#",
        },
        {
          title: "Online Hearings",
          url: "#",
        },
        {
          title: "Offline Hearings",
          url: "#",
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
          url: "#",
        },
        {
          title: "By Vehicle Number",
          url: "#",
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
