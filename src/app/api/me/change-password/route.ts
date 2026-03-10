import { NextRequest } from "next/server";
import { apiHandler } from "@/wrapper/ApiHandler";
import { MemberController } from "@/controllers/MemberController";

export const POST = apiHandler(async (req: NextRequest) => {
    return await MemberController.changePassword(req);
});
