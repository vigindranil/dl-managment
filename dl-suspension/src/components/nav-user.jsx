"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  UserRound
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { decrypt } from "@/utils/crypto";

export function NavUser() {
  const userDetails = useSelector((state) => state.auth.user);
  const [user, setUser] = useState(null);
  const { isMobile } = useSidebar()

  useEffect( () => {
    try {
      const parse_data = JSON.parse(decrypt(userDetails));
      parse_data && setUser(parse_data[0]);
     
    } catch (error) {
      console.error("Error parsing user details:", error);
      setUser({});
    }
  }, []);

  return (
    (<SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="bg-slate-300 rounded-full p-2">
                <UserRound className="size-4 bg-slate-300 text-white" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.AuthorityName}</span>
                <span className="truncate text-xs">{user?.AuthorityUserName}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="bg-slate-300 rounded-full p-2">
                  <UserRound className="size-4 bg-slate-300 text-white" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user?.AuthorityName}</span>
                  <span className="truncate text-xs">{user?.AuthorityUserName}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem> */}
            </DropdownMenuGroup>

            <Link href="/logout" className="bg-primary">
              <DropdownMenuItem>
                <LogOut />
                Logout
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>)
  );
}
