import { NextRequest } from "next/server";
import { apiHandler } from "@/frontend/wrapper/ApiHandler";
import { HttpStatusCode } from "@/shared/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/shared/lib/message";
import { StudentController } from "@/backend/controllers/StudentController";

export const GET = apiHandler(
  async (req: NextRequest, context?: { params?: { email: string } }) => {
    const params = await context?.params;
    const email = params?.email;

    if (!email) {
      return {
        status: HttpStatusCode.BAD_REQUEST,
        message: "Email is required",
      };
    }

    const result = await StudentController.getStudent({ email });

    return {
      data: result,
      status: HttpStatusCode.OK,
      message: MESSAGE.API.GET_STUDENT,
    };
  }
);
