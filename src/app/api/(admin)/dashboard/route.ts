import { NextRequest } from "next/server";
import { apiHandler } from "@/wrapper/ApiHandler";
import { DashboardController } from "@/controllers/DashboardController";

export const GET = apiHandler(async (req: NextRequest) => {
    return await DashboardController.getDashboardData(req);
});
