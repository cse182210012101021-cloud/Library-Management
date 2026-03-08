import { NextRequest } from "next/server";
import { apiHandler } from "@/wrapper/ApiHandler";
import { MemberController } from "@/controllers/MemberController";
import { getServerAuthUser } from "@/utils/UserUtils";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";

export const GET = apiHandler(async (req: NextRequest) => {
  const user = await getServerAuthUser();

  if (!user || !user.userId) {
    return {
      status: HttpStatusCode.UNAUTHORIZED,
      message: "Unauthorized",
    };
  }

  // Rewrite the URL to include userId so MemberController can pick it up
  const url = new URL(req.url);
  url.searchParams.set("userId", user.userId);
  const newReq = new NextRequest(url, req);

  return await MemberController.getMe(newReq);
});

export const PATCH = apiHandler(async (req: NextRequest) => {
  const user = await getServerAuthUser();

  if (!user || !user.userId) {
    return {
      status: HttpStatusCode.UNAUTHORIZED,
      message: "Unauthorized",
    };
  }

  // Rewrite the URL to include userId so MemberController can pick it up
  const url = new URL(req.url);
  url.searchParams.set("userId", user.userId);
  const newReq = new NextRequest(url, req);

  return await MemberController.updateMe(newReq);
});
