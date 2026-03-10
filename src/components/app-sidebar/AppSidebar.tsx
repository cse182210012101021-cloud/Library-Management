"use client";

import { useEffect, useState } from "react";
import { ApiClient } from "@/wrapper/ApiClient";
import { UserType } from "@/constant/enum/UserType";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNavItems } from "@/constant/default-values/SidebarOptions";
import { NavItemsProps } from "@/types/NavItemsProps";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { isActivePath } from "@/utils/CommonUtils";
import { AppRouterUtils } from "@/utils/AppRouterUtils";
import { useAuthUser } from "@/providers/AuthProvider";

export function AppSidebar() {
  const pathName = usePathname();
  const { user } = useAuthUser();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.userId) return;
      try {
        const res = await ApiClient(() => ({
          url: `/api/me`,
          method: "GET",
        }));
        if (res.success) {
          const userData = res.data;
          const nameFallback =
            userData.userType === UserType.ADMIN ? "ADMIN" : "User";
          setProfileData({
            name: userData.referenceId?.name || userData.name || nameFallback,
            email: userData.email,
            image: userData.referenceId?.image || userData.image,
          });
        }
      } catch (error) {
        console.error("Error fetching sidebar profile:", error);
      }
    };
    fetchProfile();
  }, [user]);

  const { primaryItems, secondaryItems } = getNavItems(user?.userType);
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-1.5">
              <a href="#">
                <span className="text-base font-semibold">
                  Library Management System
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-2">
        <NavItems items={primaryItems} pathName={pathName} />
        <NavItems
          items={secondaryItems}
          pathName={pathName}
          className="mt-auto"
        />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="py-2">
            <SidebarMenuButton
              className={`h-full cursor-pointer ${isActivePath(pathName, AppRouterUtils.PROFILE) && "bg-gray-200 dark:bg-gray-800 text-foreground"
                }`}
            >
              <Link
                href={AppRouterUtils.PROFILE}
                className="h-full flex justify-start gap-1.5"
              >
                <Avatar>
                  <AvatarImage src={profileData?.image || "https://github.com/shadcn.png"} />
                  <AvatarFallback>{profileData?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-col">
                  <h3 className="font-semibold text-sm truncate max-w-[150px]">
                    {profileData?.name || "Loading..."}
                  </h3>
                  <p className="text-[12px] truncate max-w-[150px]">
                    {profileData?.email || "..."}
                  </p>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

const NavItems = ({ items, pathName = "", className = "" }: NavItemsProps) => (
  <SidebarGroup className={className}>
    <SidebarGroupContent className="flex flex-col gap-2">
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              className={`${isActivePath(pathName, item.url) && "bg-gray-200 dark:bg-gray-800 text-foreground"}`}
              tooltip={item.title}
              asChild
            >
              <Link href={item.url}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);
