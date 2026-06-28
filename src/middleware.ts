import { NextRequest, NextResponse } from "next/server";
import { AppRouterUtils } from "./shared/utils/AppRouterUtils";
import { getMiddlewareAuthUser } from "./shared/utils/UserUtils";
import { UserType } from "./shared/constant/enum/UserType";
import { HttpStatusCode } from "./shared/constant/enum/HttpStatusCode";
import { UserToken } from "./shared/types/UserToken";
import { ApiRoutes } from "./shared/utils/ApiRoutes";

const publicPaths = [AppRouterUtils.ROOT];
const protectedPath = [
  AppRouterUtils.DASHBOARD,
  AppRouterUtils.BOOKS,
  AppRouterUtils.FINES,
  AppRouterUtils.HELP_AND_SUPPORT,
  AppRouterUtils.MEMBERS,
  AppRouterUtils.PROFILE,
  AppRouterUtils.SETTINGS,
];

const adminPaths = [ApiRoutes.BOOK];

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const token = request.cookies.get("auth_token")?.value || "";

  const user = (await getMiddlewareAuthUser(request)) as UserToken | null;

  const isPublic = publicPaths.includes(currentPath);
  const isProtected = protectedPath.includes(currentPath);
  const isAdminPath = adminPaths.includes(currentPath);

  if (isAdminPath) {
    if (!user || user.userType !== UserType.ADMIN) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required" },
        { status: HttpStatusCode.FORBIDDEN }
      );
    }
  }

  if (isPublic && token) {
    return NextResponse.redirect(
      new URL(AppRouterUtils.DASHBOARD, request.url)
    );
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL(AppRouterUtils.ROOT, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/books",
    "/fines",
    "/help-and-support",
    "/members",
    "/profile",
    "/settings",
    "/api/book",
  ],
};
