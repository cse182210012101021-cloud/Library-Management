import { NextRequest } from "next/server";
import { apiHandler } from "@/wrapper/ApiHandler";
import { FineRuleController } from "@/controllers/FineRuleController";

export const GET = apiHandler(async () => {
  return await FineRuleController.getFineRule();
});

export const POST = apiHandler(async (req: NextRequest) => {
  return await FineRuleController.updateFineRule(req);
});
