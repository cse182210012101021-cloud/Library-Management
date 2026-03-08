import { NextRequest } from "next/server";
import { apiHandler } from "@/wrapper/ApiHandler";
import { validateBook } from "@/validator/server-validate/BookValidate";
import { BookController } from "@/controllers/BookController";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/lib/message";

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
