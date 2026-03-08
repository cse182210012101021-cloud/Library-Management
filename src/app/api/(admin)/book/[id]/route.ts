import { NextRequest } from "next/server";
import { apiHandler } from "@/wrapper/ApiHandler";
import { validateBookUpdate } from "@/validator/server-validate/BookValidate";
import { BookController } from "@/controllers/BookController";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import { MESSAGE } from "@/lib/message";

export const PATCH = apiHandler(
  async (req: NextRequest, context?: { params?: { id: string } }) => {
    const params = await context?.params;
    const id = params?.id;
    if (!id) {
      throw new Error("Book ID is required");
    }
    const reqBody = await req.json();
    validateBookUpdate(reqBody);
    const result = await BookController.updateBook(id, reqBody);
    return {
      data: result,
      status: HttpStatusCode.OK,
      message: MESSAGE.API.BOOK_UPDATED,
    };
  },
);

export const DELETE = apiHandler(
  async (req: NextRequest, context?: { params?: { id: string } }) => {
    const params = await context?.params;
    const id = params?.id;
    if (!id) {
      throw new Error("Book ID is required");
    }
    await BookController.deleteBook(id);
    return {
      data: null,
      status: HttpStatusCode.OK,
      message: MESSAGE.API.BOOK_DELETED,
    };
  },
);
