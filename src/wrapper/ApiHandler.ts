import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/db";
import { HttpStatusCode } from "@/constant/enum/HttpStatusCode";
import { ApiError } from "./ApiError";

interface ApiResult {
  status?: number;
  data?: unknown;
  message?: string;
  token?: string;
}

type ApiFunction<
  Params extends Record<string, string> = Record<string, string>
> = (
  req: NextRequest,
  context?: { params?: Params }
) => Promise<ApiResult | unknown>;

export const apiHandler = <
  Params extends Record<string, string> = Record<string, string>
>(
  handler: ApiFunction<Params>
) => {
  return async (req: NextRequest, context?: { params?: Params }) => {
    try {
      await connectDB();

      const result = await handler(req, context);

      const resultData = result as ApiResult;
      const status = resultData?.status || HttpStatusCode.OK;

      const response = NextResponse.json(
        {
          status,
          data: resultData.data || resultData,
          message: resultData.message,
        },
        { status }
      );

      if (
        resultData &&
        typeof resultData === "object" &&
        "token" in resultData
      ) {
        response.cookies.set({
          name: "auth_token",
          value: resultData.token as string,
          httpOnly: true,
          maxAge: resultData.token === "" ? 0 : undefined,
          path: "/",
        });
      }

      return response;
    } catch (error: unknown) {
      const statusCode =
        error instanceof ApiError
          ? error.statusCode
          : HttpStatusCode.INTERNAL_SERVER_ERROR;

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return NextResponse.json(
        {
          status: statusCode,
          error: errorMessage,
        },
        { status: statusCode }
      );
    }
  };
};
