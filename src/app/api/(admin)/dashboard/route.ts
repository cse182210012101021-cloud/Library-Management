import { NextRequest } from "next/server";
import { apiHandler } from "@/frontend/wrapper/ApiHandler";
import { DashboardController } from "@/backend/controllers/DashboardController";

export const GET = apiHandler(async (req: NextRequest) => {
    return await DashboardController.getDashboardData(req);
});
