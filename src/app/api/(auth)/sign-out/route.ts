import { NextRequest } from "next/server";
import { apiHandler } from "@/frontend/wrapper/ApiHandler";

export const POST = apiHandler(async (req: NextRequest) => {
  return {
    message: "Successfully logged out",
    token: "",
    status: 200,
  };
});
