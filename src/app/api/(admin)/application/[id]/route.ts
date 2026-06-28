import { NextRequest } from "next/server";
import { apiHandler } from "@/frontend/wrapper/ApiHandler";
import { ApplicationController } from "@/backend/controllers/ApplicationController";

export const PATCH = apiHandler(
  async (req: NextRequest, context?: { params?: { id: string } }) => {
    return await ApplicationController.updateApplicationStatus(
      req,
      context as { params: { id: string } },
    );
  },
);
