import { AuthState } from "@/shared/constant/enum/AuthState";
import AuthSection from "@/frontend/section/auth-section/AuthSection";
import { QueryParamsProps } from "@/shared/types/QueryParamsProps";

export default async function Page({ searchParams }: QueryParamsProps) {
  const authStateParam = (await searchParams)?.authState;
  const authState =
    typeof authStateParam === "string" ? authStateParam : AuthState.LOG_IN;

  return <AuthSection authState={authState} />;
}
