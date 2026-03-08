import { NextRequest } from "next/server";
import { apiHandler } from "@/wrapper/ApiHandler";
import { validateMember } from "@/validator/server-validate/MemberValidate";
import { AuthController } from "@/controllers/AuthController";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/lib/message";

export const POST = apiHandler(async (req: NextRequest) => {
  const reqBody = await req.json();
  validateMember(reqBody);
  const result = await AuthController.logIn(reqBody);
  return {
    data: result?.data,
    token: result?.token,
    status: HttpStatusCode.OK,
    message: MESSAGE.API.USER_CREATED,
  };
});
