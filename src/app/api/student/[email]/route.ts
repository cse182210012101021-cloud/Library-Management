import { NextRequest } from "next/server";
import { apiHandler } from "@/wrapper/ApiHandler";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/lib/message";
import { StudentController } from "@/controllers/StudentController";

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
