"use client";

import { createContext, useContext, ReactNode } from "react";
import { UserToken } from "@/types/UserToken";

interface AuthContextType {
  user: UserToken | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  user,
  children,
}: {
  user: UserToken | null;
  children: ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuthUser() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuthUser must be used withing AuthProvider");
  return context;
}
