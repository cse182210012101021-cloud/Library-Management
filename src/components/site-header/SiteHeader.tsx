"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { signOutApi } from "@/constant/ApiRoutes";
import { AppRouterUtils } from "@/utils/AppRouterUtils";
import { isErrorResponse } from "@/utils/CommonUtils";
import { ApiClient } from "@/wrapper/ApiClient";
import { IconBellFilled } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/providers/AlertProvider";

export function SiteHeader() {
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const handleLogOut = async () => {
    const response = await ApiClient(signOutApi);
    if (isErrorResponse(response)) {
      showErrorToast("Log out failed", response?.error);
      return;
    }

    showSuccessToast("Successful", "Successfully log out");
    router.replace(AppRouterUtils.ROOT);
  };
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 bg-[var(--background)] z-10">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="ml-auto flex items-center gap-2">
          <IconBellFilled />
          <Button
            variant="ghost"
            onClick={handleLogOut}
            size="sm"
            className="hidden sm:flex cursor-pointer"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
