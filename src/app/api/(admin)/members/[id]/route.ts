import { NextRequest } from "next/server";
import { apiHandler } from "@/wrapper/ApiHandler";
import { MemberController } from "@/controllers/MemberController";

export const GET = apiHandler(
  async (req: NextRequest, context?: { params?: { id: string } }) => {
    return await MemberController.getMemberDetails(
      req,
      context as { params: { id: string } },
    );
  },
);
