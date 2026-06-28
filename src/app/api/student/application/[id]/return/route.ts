import { NextRequest } from "next/server";
import { apiHandler } from "@/frontend/wrapper/ApiHandler";
import { ApplicationController } from "@/backend/controllers/ApplicationController";

export const POST = apiHandler(
  async (req: NextRequest, context?: { params?: { id: string } }) => {
    return await ApplicationController.requestReturn(req, context!);
  },
);
