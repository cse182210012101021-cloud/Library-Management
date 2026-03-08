import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-full h-screen flex justify-center items-center">
      <div className="max-w-[1440px] w-full h-full">{children}</div>
    </section>
  );
}
