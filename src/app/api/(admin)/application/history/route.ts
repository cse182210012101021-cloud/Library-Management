import { NextRequest } from "next/server";
import { apiHandler } from "@/wrapper/ApiHandler";
import { ApplicationController } from "@/controllers/ApplicationController";

export const GET = apiHandler(async (req: NextRequest) => {
    return await ApplicationController.getApplicationsByAdmin(req);
});
