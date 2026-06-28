import { NextRequest } from "next/server";
import { apiHandler } from "@/frontend/wrapper/ApiHandler";
import { validateBook } from "@/backend/validator/server-validate/BookValidate";
import { BookController } from "@/backend/controllers/BookController";
import { HttpStatusCode } from "@/shared/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/shared/lib/message";

export const POST = apiHandler(async (req: NextRequest) => {
  const reqBody = await req.json();
  validateBook(reqBody);
  const result = await BookController.addBook(reqBody);
  return {
    data: result,
    status: HttpStatusCode.OK,
    message: MESSAGE.API.BOOK_CREATED,
  };
});
