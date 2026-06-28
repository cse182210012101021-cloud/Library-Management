import { NextRequest } from "next/server";
import { apiHandler } from "@/frontend/wrapper/ApiHandler";
import { ApplicationController } from "@/backend/controllers/ApplicationController";

export const GET = apiHandler(async (req: NextRequest) => {
    return await ApplicationController.getApplicationsByAdmin(req);
});
