import { NextRequest } from "next/server";
import { apiHandler } from "@/wrapper/ApiHandler";
import { ApplicationController } from "@/controllers/ApplicationController";

export const DELETE = apiHandler(
  async (req: NextRequest, context?: { params?: { id: string } }) => {
    return await ApplicationController.deleteApplication(req, context!);
  },
);

export const PATCH = apiHandler(
  async (req: NextRequest, context?: { params?: { id: string } }) => {
    return await ApplicationController.updateApplication(req, context!);
  },
);
