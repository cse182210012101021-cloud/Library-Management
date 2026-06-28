import { NextRequest } from "next/server";
import { apiHandler } from "@/frontend/wrapper/ApiHandler";
import { MemberController } from "@/backend/controllers/MemberController";

export const POST = apiHandler(async (req: NextRequest) => {
    return await MemberController.changePassword(req);
});
