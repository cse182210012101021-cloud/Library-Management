import React from "react";
import { SidebarProvider, SidebarInset } from "@/frontend/components/ui/sidebar";
import { AppSidebar } from "@/frontend/components/app-sidebar/AppSidebar";
import { SiteHeader } from "@/frontend/components/site-header/SiteHeader";
import { getServerAuthUser } from "@/shared/utils/UserUtils";
import { AuthProvider } from "@/shared/providers/AuthProvider";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerAuthUser();
  return (
    <AuthProvider user={user}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
