import { NextRequest } from "next/server";
import { DashboardService } from "@/services/DashboardService";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/lib/message";

export class DashboardController {
    static async getDashboardData(req: NextRequest) {
        const data = await DashboardService.getDashboardData();

        return {
            status: HttpStatusCode.OK,
            data,
            message: "Dashboard data retrieved successfully",
        };
    }
}
