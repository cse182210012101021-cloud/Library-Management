import { NextRequest } from "next/server";
import { apiHandler } from "@/wrapper/ApiHandler";
import { ApplicationController } from "@/controllers/ApplicationController";

export const POST = apiHandler(async (req: NextRequest) => {
  return await ApplicationController.createApplication(req);
});

export const GET = apiHandler(async (req: NextRequest) => {
  return await ApplicationController.getApplicationsByUser(req);
});
