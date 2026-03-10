import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/providers/AlertProvider";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Library Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
