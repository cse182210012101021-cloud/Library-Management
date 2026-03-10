import { NextRequest } from "next/server";
import { DashboardService } from "@/services/DashboardService";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/lib/message";

export class DashboardController {
    static async getDashboardData(req: NextRequest) {
        const userId = req.nextUrl.searchParams.get("userId");
        const userType = req.nextUrl.searchParams.get("userType");

        const data = await DashboardService.getDashboardData(userId, userType);

        return {
            status: HttpStatusCode.OK,
            data,
            message: "Dashboard data retrieved successfully",
        };
    }
}
