import { NextRequest } from "next/server";
import { apiHandler } from "@/frontend/wrapper/ApiHandler";
import { MemberController } from "@/backend/controllers/MemberController";

export const GET = apiHandler(
  async (req: NextRequest, context?: { params?: { id: string } }) => {
    return await MemberController.getMemberDetails(
      req,
      context as { params: { id: string } },
    );
  },
);
