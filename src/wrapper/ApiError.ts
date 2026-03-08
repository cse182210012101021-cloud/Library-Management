import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";

export class ApiError extends Error {
  declare statusCode: number;

  constructor(
    message: string,
    statusCode: number = HttpStatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}
