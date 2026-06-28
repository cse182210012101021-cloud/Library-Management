import { NextRequest } from "next/server";
import { apiHandler } from "@/frontend/wrapper/ApiHandler";
import { validateMember } from "@/backend/validator/server-validate/MemberValidate";
import { AuthController } from "@/backend/controllers/AuthController";
import { HttpStatusCode } from "@/shared/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/shared/lib/message";

export const POST = apiHandler(async (req: NextRequest) => {
  const reqBody = await req.json();
  // await validateMember(reqBody);
  const result = await AuthController.signUp(reqBody);
  return {
    data: result,
    status: HttpStatusCode.OK,
    message: MESSAGE.API.USER_CREATED,
  };
});
