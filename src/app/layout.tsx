import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/providers/AlertProvider";

export const metadata: Metadata = {
  title: "Library Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
